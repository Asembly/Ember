# MEMORY.md — Ember / Talis

> Перенесённый контекст проекта из предыдущего чата. Обновлено: 2026-11-17.
> Источник истины — код в репозитории. Если документ расходится с кодом, верь коду.

---

## 1. Что это

**Ember** (в UI — **Talis**) — full-stack трекер задач с геймификацией: XP, уровни, атрибуты,
достижения, лидерборд, учёт времени по задачам и Pomodoro.

Работает в двух режимах из одного кода:

- **desktop** — Electron-обёртка (`APP_MODE` не задан);
- **web** — обычная SPA (`APP_MODE=web`), раздаётся nginx в Docker.

Репозиторий: `/home/asmbly/projects/Ember` (`frontend/`, `backend/`, `docker-compose.yml`).

---

## 2. Стек и версии

| Слой | Технологии |
|---|---|
| Frontend | React 18.3, Zustand 5, Tailwind 3.4, Vite 5, React Router 6 (HashRouter), Axios, Electron 33 |
| Backend | Java 17, Spring Boot, Spring Security + JWT, JPA/Hibernate, PostgreSQL 16, Flyway, MapStruct, Lombok, Springdoc |
| Инфраструктура | Docker Compose: `db` (Postgres 16-alpine), `backend`, `frontend` (nginx 1.27-alpine) |

Сборка backend: Maven (`backend/pom.xml`), компиляция — `mvn -o -q -DskipTests compile`.

---

## 3. Запуск и настройки окружения

### Docker Compose (`docker-compose.yml`, project name `talis`)

| Сервис | Порт (host → container) | Примечание |
|---|---|---|
| `db` | `5433 → 5432` | healthcheck `pg_isready`, volume `db-data` |
| `backend` | `8080 → 8080` | ждёт healthy db; `develop.watch` пересобирает при изменении `./backend` |
| `frontend` | `5173 → 80` | nginx, healthcheck `/healthz` |

ENV: `DB_NAME=db`, `DB_USER=postgres`, `DB_PASSWORD=postgres`, `DB_PORT=5433`, `API_PORT=8080`,
`WEB_PORT=5173`, `VITE_API_URL=/api/v1`, JWT-секреты с дефолтами.

### Backend (`backend/src/main/resources/application.yaml`)

- `spring.mvc.servlet.path: /api/v1` — все контроллеры живут **относительно** этого префикса.
- `spring.jpa.hibernate.ddl-auto: none` — схема только через Flyway (`db/migration/V1..V3`).
- Datasource по умолчанию: `jdbc:postgresql://localhost:5432/db`, `postgres/postgres`.
- JWT: access 86 400 000 мс (24 ч), refresh 604 800 000 мс (7 дней), секрет в конфиге/ENV.
- Есть `application-dev.yaml` (локальный профиль).

### Frontend

- `npm run dev` — Electron + Vite; `npm run dev:web` — только web (`APP_MODE=web`);
  `npm run build` — `vite build` (в Electron-режиме подключается `vite-plugin-electron/simple`);
  `npm start` — запуск собранного Electron-приложения.
- `vite.config.js`: `base: './'` (нужно для `file://` в Electron), dev-порт 5173, `outDir: dist`.
- `index.html` грузит Google Fonts **Unbounded** (display), **Onest** (body), **Nunito** и
  **Comfortaa** (тема Midnight); Forest использует системный Palatino/Georgia — см. §6.
- `frontend/.env.example`: `VITE_API_URL=http://localhost:8080/api/v1`.
- `src/api/client.js`: `API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.180:8080/api/v1'`
  — **жёсткий fallback на LAN-IP автора**; в Docker при сборке передаётся `/api/v1`.
- nginx проксирует `/api/` на `http://backend:8080` с сохранением пути, `try_files ... /index.html`
  для SPA, `location = /healthz` → `ok`.

---

## 4. Backend: домен и API

### Домен

`User` (auth) → `Profile` (`user_id`, 1:1) → `Task`, `TimeSession`, `ProfileAttributes`,
`ProfileAchievements`; отдельно `Action` (+ `ActionAttributes`), `Tag` (`task_tags`), `Achievement`.

`LevelEntity` (общий для Profile и ProfileAttributes): `currentXp`, `level` (с 1),
`nextLevelUp` (стартует со 100 и умножается на **1.2** при каждом level-up).

### Начисление XP

- `TaskRewardCalculator.calculatePotentialXp` = `action.baseXp × difficulty.multiplier`.
- `XpService.reward(task, difficulty, duration)` — после завершения сессии:
  `xp = baseXp × attribute.levelCoefficient × difficulty × duration × weight`, делится на `baseXp`
  для профиля, начисляется и профилю, и каждому атрибуту действия.
- Level-up публикует `ProfileLevelUpEvent`; завершение задачи — `TaskCompletedEvent`
  (обрабатывается `AchievementTracker`).
- Достижения на фронте считаются из stats (`src/lib/achievements.js`), сервер отдаёт только
  атрибуты и профиль.

### REST (все пути под `/api/v1`)

| Метод | Путь | Назначение |
|---|---|---|
| POST | `/auth/register`, `/auth/authenticate`, `/auth/refresh-token` | JWT |
| GET | `/profile/get` | список профилей |
| GET | `/profile/get/{id}` | профиль |
| GET | `/profile/get/{id}/attribute` | атрибуты профиля |
| GET | `/profile/get/leaderboard?page=0&limit=10` | лидерборд (0-based, `List<ProfileResponseDto>`) |
| GET | `/task/get`, `/task/get/{id}`, `/task/get/profile/{profileId}` | задачи |
| POST | `/task/create` | создание |
| PATCH | `/task/{id}/status/done`, `/task/{id}/status/cancel` | завершение/отмена |
| POST | `/task/{id}/timer/start` | старт сессии |
| PATCH | `/task/{id}/timer/stop` | стоп сессии |
| PATCH | `/task/{id}/difficulty` | смена сложности |
| GET | `/session/get`, `/session/get/{id}` | сессии |
| GET | `/session/get/active/{profileId}` | активная сессия профиля, `404` если нет |
| GET/POST | `/action/get`, `/action/create` | действия |
| GET/POST | `/tag/get`, `/tag/get/{id}`, `/tag/create` | теги |

### DTO

```java
ProfileResponseDto(Long id, String nickname, Integer level, Integer currentXp, BigDecimal nextLevelUp)
TaskResponseDto(Long id, String name, String description, StatusTask status, Difficulty difficulty,
                LocalDateTime createdAt, LocalDateTime deadline, LocalDateTime finishedAt,
                LocalDateTime scheduledAt, BigDecimal potentialXp)
TimeSessionResponseDto(Long id, LocalDateTime createdAt, LocalDateTime endTime, Long durationInMin)
ActiveSessionResponseDto(Long sessionId, Long taskId, Instant startedAt)
```

### Инвариант «одна активная сессия на профиль»

- Таблица `active_session` (`profile_id` UNIQUE, `time_session_id` UNIQUE, FK ON DELETE CASCADE) —
  **в БД, не в HashMap**.
- `start`: удаляется протухшая запись (если `TimeSession.endTime` уже заполнен), затем создаётся новая.
- `stop` / `done` / `cancel`: сессия закрывается **и** строка `active_session` удаляется.
- Конкурентный `start` → `409 Conflict`; фронт по `409` подтягивает реальную активную сессию.
- `TimeSessionMapper.toInstant(LocalDateTime)` переводит `createdAt` в `Instant` через
  `ZoneId.systemDefault()` (в Docker это UTC).

---

## 5. Frontend: архитектура

### Точка входа и роутинг

- `src/main.jsx`: тема применяется **до** первого рендера, затем `HashRouter` + `App`
  (`HashRouter` обязателен для `file://` в Electron).
- `src/App.jsx`: `useLayoutEffect` применяет тему при смене; `setUnauthorizedHandler`
  прокидывает `401` в `authStore.handleUnauthorized`.
- Маршруты: `/login`, `/register` (обёрнуты в `PublicOnly`), далее `RequireAuth` + `AppLayout`:
  `index → Dashboard`, `tasks`, `achievements`, `leaderboard`, `history`, `*` → `/`.

### Страницы

`Dashboard` (обзор: стат-плитки, LevelRing, BalanceRadar, Pomodoro, прогресс, достижения),
`Tasks` (список, фильтры, таймеры, модалки создания/редактирования, библиотека действий),
`Achievements`, `Leaderboard`, `History`, `Login`, `Register`.

### Сторы (Zustand)

| Стор | Роль | Persist |
|---|---|---|
| `authStore` | login/register/logout, JWT-identity, `handleUnauthorized` | токены в `localStorage['talis.auth']` (не через persist-middleware) |
| `profileStore` | профиль + атрибуты, `init()`, `refresh()` | — |
| `taskStore` | задачи, действия, теги, статусы | — |
| `sessionStore` | сессии, `activeByTask`, start/stop, `fetchActiveSession` | `talis.activeTimers` |
| `pomodoroStore` | фазы focus/short/long, пресеты 15/25/50, связь с сессией | `talis.pomodoro` |
| `achievementStore` | stats/items/unlocked | — |
| `leaderboardStore` | пагинация лидерборда | — |
| `taskTagStore` | теги задач | `talis.taskTags` |
| `themeStore` | `currentThemeId` + `setTheme` | `talis.theme` (version 3) |
| `toastStore` | уведомления `notify()` | — |

### API-клиент (`src/api/client.js`)

- Токены: `access_token`, `refresh_token` (нормализуются из `accessToken`/`refreshToken`/`token`/`jwt`).
- Request interceptor добавляет `Authorization: Bearer`, **кроме** URL с `/auth/`.
- Response interceptor: `401` вне auth-вызовов → `clearAuth()` + `unauthorizedHandler()`.
- `getErrorMessage()` переводит коды в русские сообщения (403 → «Неверная почта или пароль», и т.д.).
- Auth-эндпоинты вызываются напрямую (`authApi`), без retry-хелпера. В `endpoints.js` остался
  неиспользуемый `authRequest`/`AUTH_PREFIXES` — мёртвый код (см. §10).

### Ключевые компоненты

`AppLayout` (сайдбар 256px: лого `talis`, навигация, промо-карточка, выбор темы, профиль с XP,
logout; шапка 64px с хлебными крошками, датой и чипом уровня; мобильная навигация ниже `lg`;
`<Outlet/>` в скролл-области), `TaskCard`, `TaskTimer`, `SegmentBar` (сегментный XP-бар),
`TaskFormModal`, `LibraryModal`, `PomodoroTimer`, `LevelRing` (сплошной `var(--c-accent)`, без SVG-градиента),
`BalanceRadar`, `ProgressBar`, `AchievementCard`, `Modal`, `ConfirmDialog`,
`EmptyState`, `Skeleton`, `Toasts`, `ThemeSwitcher`, `AuthShell`, `Brand`, `icons.jsx`.

---

## 6. Дизайн-система и темы

Дизайн переработан по Figma-референсу (dashboard 1440×1120): тёмная графитовая база, лиловый
акцент, лаймовый CTA/XP, оранжевый hero, крупная типографика Unbounded + Onest, плоские поверхности
без теней и градиентов.

### Сетка референса → реализация

| Референс | В проекте |
|---|---|
| sidebar 256px, topbar 64px | `AppLayout`: `w-64`, `h-16` |
| контент: padding 32, правая колонка 320, gap 24 | `px-8 py-8`, `xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-6` |
| карточки: radius 24 (крупные) / 16 / 12 (контролы) | `--radius-lg` / `--radius` / `--radius-sm` |
| палитра zinc + violet-400 + lime-200 + orange-300 | токены темы `ember` |
| шрифты Unbounded (заголовки) + Onest (текст) | `--font-display` / `--font-family` |

### Конфиг (`src/config/themes.js`)

Три темы: `ember` (по умолчанию), `midnight`, `forest`. Каждая: `id`, `label`, `hint`, `scheme` +
два блока токенов:

- `colors` — **23** токена `--c-*`: canvas, sidebar, surface, raised, sunken, line, ink, muted,
  accent, accent-strong, accent-soft, accent-ink, positive, negative, warning, cta, cta-ink,
  hero, hero-ink, glow, glow-2, shadow, shadow-lg;
- `design` — **8** токенов: `--radius`, `--radius-sm`, `--radius-lg`, `--shadow`, `--spacing`,
  `--border-width`, `--font-family`, `--font-display`.

| Тема | Canvas | Surface | Accent | CTA | Hero | Radius | Тень | Шрифт |
|---|---|---|---|---|---|---|---|---|
| Ember | `#18181B` | `#27272A` | `#A78BFA` | `#D9F99D` | `#FDBA74` | 16/12/24 | none | Unbounded + Onest |
| Midnight | `#0B1020` | `#111A33` | `#5B8CFF` | `#7DE2C3` | `#5B8CFF` | 20/14/28 | `0 8px 24px rgba(0,0,0,.45)` | Comfortaa + Nunito |
| Forest | `#0D1512` | `#14201B` | `#52C184` | `#B7E4C7` | `#E9C46A` | 8/6/14 | `0 2px 8px rgba(0,0,0,.24)` | Palatino/Georgia (serif) |

`applyTheme(themeId, root?)` пишет оба блока через `style.setProperty` на `<html>`, ставит
`colorScheme` и `data-theme`. `DEFAULT_THEME_ID`, `themeList`, `getTheme`, `isThemeId` — публичный API.

### Как применяется

1. `main.jsx` — до `ReactDOM.createRoot` (нет вспышки неверных цветов).
2. `App.jsx` — `useLayoutEffect` при смене `currentThemeId`.
3. `themeStore` — persist `talis.theme` (v3), миграция старых id в `ember`, валидация в `merge`.
4. `ThemeSwitcher` — карточка «Твоя атмосфера» в сайдбаре (активная тема подсвечена hero-цветом,
   остальные — строкой ниже) + компактная полоса свотчей для узких экранов.

### CSS (`src/index.css`)

- Никаких `:root` / `[data-theme]` — только runtime-переменные.
- Базовые классы: `.card`, `.card-lg`, `.card-inset`, `.card-hover`, `.btn` + `.btn-primary`
  (CTA), `.btn-accent`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-contrast`
  (кнопка на яркой поверхности), `.btn-sm`, `.btn-icon`, `.input`, `.label`, `.chip` +
  тональные `.chip-accent/-positive/-warning/-negative/-ink`, `.nav-link`, `.nav-badge`,
  `.tab` (сегментные фильтры, активное состояние по `aria-pressed="true"`), `.eyebrow`,
  `.page-title`, `.section-title`, `.display`, `.stat-value`, `.mono-time`, `.surface-divider`,
  `.dot-open/-progress/-done/-canceled`, `.row-hover`, `.scroll-area`.
- Все радиусы/тени/отступы — через токены; микро-радиусы считаются как
  `calc(var(--radius-sm) * k)`, чтобы форма менялась вместе с темой.
- `tailwind.config.cjs`: цвета → `var(--c-*)` (включая `sunken`, `cta`, `hero`), `fontFamily.sans`
  → `--font-family`, `fontFamily.display` → `--font-display`, радиусы `xl/2xl/3xl` → токены.

### Типографика

- Заголовки карточек/секций и крупные цифры — `.display` / `.section-title` / `.page-title`
  (Unbounded, medium/bold, tracking −0.01em).
- Текст — Onest 10–13.5px, метки — uppercase 9–10px с tracking 0.12–0.16em.
- Hero: 30px/40px bold; таймер Pomodoro: 42px display; стат-значения: 24px bold.

### Зафиксированные правила визуала

- **Никаких градиентов** — только сплошные цвета (в т.ч. SVG).
- **Цвета не хардкодятся в компонентах** — только через токены/конфиг тем; hex остаётся лишь
  в данных (`TAG_COLORS`, `ATTRIBUTE_COLORS` в `lib/meta.js`).
- Иерархия поверхностей: canvas → surface (карточки) → raised (инсет-панели/активная строка) →
  sunken (поля поиска, чипы, графики).
- Круглыми остаются только точки, аватары-кружки и прогресс-полосы.

---

## 7. Кодовые решения и разобранные баги

### 7.1. Таймер показывал `180:00`

Причина: backend отдавал `LocalDateTime` без зоны, контейнер в UTC, браузер в Europe/Moscow →
сдвиг ровно +3 часа. Решение: живой таймер якорится на **клиентских** часах
(`resolveStartedAt` берёт серверное время только при явной зоне: `Z` или `±HH:MM`), а легаси-записи
в `localStorage` переякориваются (`normalizeActiveTimers`). Финальную длительность всё равно считает сервер.

### 7.2. После `logout` сессия «зависала»

Было: клиент чистил `activeByTask`, а `active_session` в БД оставалась; узнать задачу было нельзя.
Сделано: `GET /session/get/active/{profileId}` (+ DTO), `sessionStore.fetchActiveSession(profileId)`
вызывается из `AppLayout` после готовности профиля; `404` очищает локальное состояние; `409` при
старте подтягивает реальную сессию. В `sessionStore` есть счётчик `activeSyncRequest` — поздний ответ
не перезапишет более свежее локальное состояние; плюс сверка `profileId`.

### 7.3. «Таймер начинается с нуля после reload»

Причина: `ActiveSessionResponseDto.startedAt` был `LocalDateTime` без зоны, а фронт намеренно не
доверяет времени без зоны (`resolveStartedAt` → `now`), поэтому каждая перезагрузка переякоривала старт.
Решение: DTO переведён на **`Instant`**, MapStruct-маппер конвертирует `LocalDateTime → Instant` через
`ZoneId.systemDefault()`, Jackson отдаёт строку с `Z`, фронт принимает её как абсолютный момент.

### 7.4. Лидерборд

`leaderboardStore`: `users`, `page` (0-based, хранит **последнюю успешно загруженную** страницу),
`hasMore`, `isLoading`, `error`. `fetchLeaderboard(reset)`:
- `reset` → чистит `users`, `page = 0`;
- иначе грузит `page + 1`;
- защита от параллельных запросов (`isLoading`) и от «load more» после конца;
- `hasMore = raw.length >= PAGE_SIZE` (`PAGE_SIZE = 10`);
- дедупликация по `id` (и внутри батча, и с уже загруженными);
- `extractList` понимает и массив, и `{ content: [...] }`.

### 7.5. Профиль без `/me`

Эндпоинта «текущий пользователь» нет: `profileStore.pickProfile()` сопоставляет список профилей с
`nickname` из JWT (сохранён в `talis.auth`), fallback — первый профиль. Если появится `/profile/me`,
это место надо заменить.

### 7.6. Auth

Identity берётся из JWT (`sub`/`email`, `nickname`/`name`), пароль не хранится; истёкший access
не считается авторизацией при старте. `resetWorkspace()` при logout чистит все сторы, **кроме**
persist-ключей темы/якоря сессий (якорь нужен для восстановления).

---

## 8. Договорённости (важно соблюдать)

1. **Backend не менять без явного разрешения.** Текущая задача — frontend. Исключение: уже внесённые
   изменения для активной сессии (`active_session`, `GET /session/get/active/{profileId}`,
   `Instant startedAt`) — они нужны фронту, их не откатывать.
2. **Не ломать бизнес-логику**: обработчики, API-вызовы, сторы, роутинг, состояния. Визуальные
   правки не должны менять поведение.
3. **Никаких градиентов**, только сплошные цвета.
4. **Цвета — только через конфиг тем** (`themes.js` → CSS-переменные), не hex в компонентах.
5. **Тема меняет не только цвет, но и характер**: радиусы, тени, плотность, шрифт.
6. **Адаптивность сохраняется**, все hover/active/focus/disabled состояния остаются.
7. Ответы пользователю — **по-русски**.
8. Не переписывать работающий код без необходимости, не создавать дублирующую функциональность.

---

## 9. Текущий прогресс

Коммиты: `d021172` init → `7b84d06` leaderboard → `0fecc43` theme config →
`2d84d0c`, `b59ddc2` time-session fixes. Редизайн по Figma — **в рабочем дереве, не закоммичен**.

### Сделано и проверено

- **Лидерборд**: API-метод, стор с пагинацией, роут, пункт в `NAV_ITEMS` между «Достижения» и
  «История», страница со скелетонами, топ-3, аватаром-инициалом, уровнем/XP и кнопкой «Загрузить ещё».
- **Темы**: 3 темы, цвета + дизайн-токены, runtime-применение до первого рендера,
  persist + миграция + валидация, свитчер-карточка в сайдбаре и компактный вариант для мобильных.
- **Редизайн всех экранов** (2026-11-17): `index.html` (Unbounded/Onest), `index.css` (новые
  классы и токены), `tailwind.config.cjs`, `AppLayout`, `ThemeSwitcher`, `Dashboard`
  (hero с LevelRing, 4 стат-карточки, карточка задач с табами-фильтрами, «Твой ритм» с 7-дневным
  графиком, правая колонка: Pomodoro → прогресс с сегментным XP-баром и атрибутами → радар),
  `Tasks` (тулбар в две строки, фильтры-табы, сетка карточек), `TaskCard` (строка с маркером
  статуса, чипами, XP, таймером и действиями), `Achievements`, `Leaderboard`, `History`,
  `Login`/`Register`/`AuthShell`, `Modal`, `EmptyState`, `Toasts`, `TaskFormModal`,
  `LibraryModal`, `AchievementCard`, `LevelRing` (параметризованные цвета), `Brand`.
  Новый компонент — `SegmentBar` (20-сегментный XP-бар).
- **Таймеры и сессии**: клиентский якорь, `Instant` в DTO, восстановление после logout/reload,
  обработка `404`/`409`, защита от гонок, очистка `active_session` при stop/done/cancel.

### Как проверено

- `npx vite build` проходит (основной бандл + `dist-electron/main.js`), CSS собирается Tailwind
  (`25.95 kB`, gzip 5.9 kB).
- Babel: все 45 JS/JSX-файлов парсятся.
- Аудит классов: все утилиты из JSX присутствуют в собранном CSS.
- Токены: у всех тем одинаковый набор (23 цвета + 8 design), `applyTheme` пишет 31 свойство;
  неиспользуемых/неопределённых `--c-*` нет.
- Градиентов нет, хардкод-hex в JSX нет, не-круговых `rounded-*`/`shadow-*` нет.

### Не проверено

- Визуальная проверка в браузере/скриншоты не выполнялись: сервис предпросмотра и браузер
  в окружении недоступны. Вёрстку нужно глазами проверить в `npm run dev`/Electron.

---

## 10. Известные проблемы и TODO

- [ ] **Визуальная проверка**: прогнать `npm run dev` и пройти все страницы в трёх темах,
      проверить переносы на 1024/1280/1440 и мобильной ширине; поправить локальные отступы,
      если где-то длинные подписи ломают сетку.
- [ ] **Шрифты грузятся с Google Fonts** (`index.html`) — в офлайне Electron будет fallback.
      При необходимости self-host Unbounded/Onest/Nunito/Comfortaa.
- [ ] **Мёртвый код** в `src/api/endpoints.js`: `AUTH_PREFIXES`/`authRequest` не используются
      (`authApi` ходит напрямую). Решить: удалить или перевести `authApi` на хелпер.
- [ ] **Хардкод LAN-IP** `192.168.0.180:8080` в `client.js` как fallback — вынести в env/дефолт
      `http://localhost:8080/api/v1`, чтобы не ломалось на другой машине.
- [ ] **`/profile/me` отсутствует** — выбор профиля по никнейму из JWT хрупок (переименование,
      дубликаты). Бэкенд-задача на будущее.
- [ ] **Легаси-якоря таймеров**: сессии, чей `startedAt` был переякорен на «сейчас» до перехода на
      `Instant`, могут показывать меньшее время, пока их не остановят/не запустят заново.
- [ ] **Нет глобального поиска/настроек** из референса — в приложении нет таких функций,
      поэтому в топбаре их сознательно нет (не создаём фиктивные контролы).
- [ ] **`--c-glow*`, `--c-shadow*`** пока не используются в новом UI (задел под подсветку);
      при желании удалить из конфига.

---

## 11. Как проверять изменения

1. `npx vite build` — основной способ (в workspace-write режиме проходит; собирает и Electron-main).
   Отдельно CSS: `npx tailwindcss -i src/index.css -o /tmp/out.css`.
2. Синтаксис JS/JSX — `@babel/parser` (пакет уже установлен) по всем файлам `src/**/*.{js,jsx}`.
3. Логику сторов — прогонять исходники с моками API в Node (Zustand-сторам нужен `window`:
   `window.localStorage` замокать).
4. Backend — `mvn -o -q -DskipTests compile` в `backend/`.
5. Ручные критерии: нет градиентов, нет не-круговых `rounded-*`/`shadow-*`, все цвета — `var(--c-*)`,
   три темы переключаются без перезагрузки и меняют форму/шрифт, таймер продолжает идти после
   reload и после logout/login, лидерборд догружается и не дублирует записи.
