import { useMemo, useState } from 'react'
import TaskCard from '../components/TaskCard'
import TaskFormModal from '../components/TaskFormModal'
import LibraryModal from '../components/LibraryModal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import {
    LayersIcon,
    PlusIcon,
    RefreshIcon,
    SearchIcon,
    TagIcon,
    TasksIcon,
} from '../components/icons'
import { useProfileStore } from '../stores/profileStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTaskStore } from '../stores/taskStore'
import { useTaskTagStore } from '../stores/taskTagStore'
import { notify } from '../stores/toastStore'
import { DIFFICULTY_FILTERS, STATUS_FILTERS, tagColorHex } from '../lib/meta'
import { getErrorMessage } from '../api/client'
import { plural } from '../lib/format'

export default function Tasks() {
    const profileId = useProfileStore((state) => state.profileId)
    const attributes = useProfileStore((state) => state.attributes)

    const tasks = useTaskStore((state) => state.tasks)
    const actions = useTaskStore((state) => state.actions)
    const tags = useTaskStore((state) => state.tags)
    const pendingTaskId = useTaskStore((state) => state.pendingTaskId)
    const status = useTaskStore((state) => state.status)

    const tagMap = useTaskTagStore((state) => state.map)

    const activeByTask = useSessionStore((state) => state.activeByTask)
    const busyTaskId = useSessionStore((state) => state.busyTaskId)

    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [difficultyFilter, setDifficultyFilter] = useState('ALL')
    const [tagFilter, setTagFilter] = useState('ALL')

    const [formOpen, setFormOpen] = useState(false)
    const [libraryOpen, setLibraryOpen] = useState(false)
    const [cancelTarget, setCancelTarget] = useState(null)
    const [cancelBusy, setCancelBusy] = useState(false)

    const decorated = useMemo(() => {
        const byId = new Map(tags.map((tag) => [Number(tag.id), tag]))

        return tasks.map((task) => {
            const ids = tagMap[task.id] || []
            const taskTags = ids
                .map((id) => byId.get(Number(id)))
                .filter(Boolean)
                .map((tag) => ({ ...tag, hex: tagColorHex(tag.color) }))

            return { ...task, tags: taskTags }
        })
    }, [tasks, tags, tagMap])

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase()

        return decorated.filter((task) => {
            if (statusFilter !== 'ALL' && task.status !== statusFilter) return false
            if (difficultyFilter !== 'ALL' && task.difficulty !== difficultyFilter) return false
            if (tagFilter !== 'ALL' && !task.tags.some((tag) => Number(tag.id) === Number(tagFilter))) {
                return false
            }
            if (!needle) return true
            return (
                String(task.name || '').toLowerCase().includes(needle) ||
                String(task.description || '').toLowerCase().includes(needle)
            )
        })
    }, [decorated, query, statusFilter, difficultyFilter, tagFilter])

    const activeCount = tasks.filter(
        (task) => task.status === 'OPEN' || task.status === 'IN_PROGRESS',
    ).length

    function reportError(error) {
        useTaskStore.getState().clearError()
        notify(getErrorMessage(error), 'error')
    }

    async function handleCreate(payload) {
        const tagsId = Array.isArray(payload.tagsId) ? payload.tagsId.map(Number) : []

        const result = await useTaskStore.getState().createTask({
            ...payload,
            tagsId,
            profileId,
        })

        let created = result?.id != null ? result : result?.data ?? null
        if (!created || created.id == null) {
            const list = useTaskStore.getState().tasks
            created = [...list].reverse().find((task) => task.name === payload.name) || null
        }

        if (created?.id != null) {
            useTaskTagStore.getState().assign(created.id, tagsId)
        }

        notify('Задача создана', 'success')
    }

    async function handleCreateTag({ name, color }) {
        const created = await useTaskStore.getState().createTag({
            profileId,
            name,
            description: '',
            color,
        })

        const resolved =
            created?.id != null
                ? created
                : useTaskStore
                    .getState()
                    .tags.find(
                        (tag) => String(tag.name || '').toLowerCase() === String(name || '').toLowerCase(),
                    ) || null

        notify('Тег добавлен', 'success')
        return resolved
    }

    async function handleCreateAction(payload) {
        const action = await useTaskStore.getState().createAction(payload)
        notify('Действие добавлено', 'success')
        return action
    }

    async function handleStart(task) {
        try {
            await useSessionStore.getState().start(task.id)
            notify('Сессия запущена', 'success')
        } catch (error) {
            if (error?.response?.status === 409) {
                notify('Уже идёт сессия по другой задаче. Остановите её, чтобы начать новую.', 'error')
                return
            }
            reportError(error)
        }
    }

    async function handleStop(task) {
        try {
            const session = await useSessionStore.getState().stop(task.id)
            const minutes = Number(session?.durationInMin) || 0
            notify(
                minutes > 0 ? `Сессия завершена · ${minutes} мин` : 'Сессия завершена',
                'success',
            )
        } catch (error) {
            reportError(error)
        }
    }

    async function handleDone(task) {
        try {
            await useTaskStore.getState().completeTask(task.id)
            useSessionStore.getState().dropTask(task.id)
            await Promise.allSettled([
                useSessionStore.getState().fetchSessions(true),
                useProfileStore.getState().refresh(),
            ])
            notify('Задача завершена', 'success')
        } catch (error) {
            reportError(error)
        }
    }

    async function handleDifficulty(task, difficulty) {
        try {
            await useTaskStore.getState().changeDifficulty(task.id, difficulty)
        } catch (error) {
            reportError(error)
        }
    }

    async function confirmCancel() {
        if (!cancelTarget) return
        setCancelBusy(true)

        try {
            await useTaskStore.getState().cancelTask(cancelTarget.id)
            useSessionStore.getState().dropTask(cancelTarget.id)
            await Promise.allSettled([useSessionStore.getState().fetchSessions(true)])
            notify('Задача отменена', 'default')
            setCancelTarget(null)
        } catch (error) {
            reportError(error)
        } finally {
            setCancelBusy(false)
        }
    }

    const filtersActive =
        statusFilter !== 'ALL' ||
        difficultyFilter !== 'ALL' ||
        tagFilter !== 'ALL' ||
        query.trim() !== ''

    return (
        <div className="space-y-4">
            <section className="card card-lg p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-[180px] flex-1 sm:max-w-[320px]">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                            <SearchIcon size={14} />
                        </span>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="input w-full pl-9"
                            placeholder="Поиск задач"
                            aria-label="Поиск задач"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setLibraryOpen(true)}
                        >
                            <LayersIcon size={13} />
                            Действия
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setFormOpen(true)}
                        >
                            <PlusIcon size={13} />
                            Новая задача
                        </button>
                    </div>
                </div>

                <div
                    className="mt-3 flex flex-wrap items-center gap-2 pt-3"
                    style={{ borderTop: '1px solid var(--c-line)' }}
                >
                    <div
                        className="flex items-center gap-1 overflow-x-auto"
                        role="group"
                        aria-label="Статус задач"
                    >
                        {STATUS_FILTERS.map((filter) => {
                            const active = statusFilter === filter.id

                            return (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => setStatusFilter(filter.id)}
                                    aria-pressed={active}
                                    className="tab shrink-0"
                                >
                                    {filter.label}
                                </button>
                            )
                        })}
                    </div>

                    <select
                        value={difficultyFilter}
                        onChange={(event) => setDifficultyFilter(event.target.value)}
                        className="input h-9 w-[150px] text-[11px]"
                        aria-label="Сложность"
                    >
                        {DIFFICULTY_FILTERS.map((filter) => (
                            <option key={filter.id} value={filter.id}>
                                {filter.label}
                            </option>
                        ))}
                    </select>

                    <span className="ml-auto text-[10.5px]" style={{ color: 'var(--c-muted)' }}>
                        {activeCount}{' '}
                        {plural(activeCount, 'активная задача', 'активные задачи', 'активных задач')} · всего{' '}
                        {tasks.length}
                        {filtersActive ? ` · показано ${filtered.length}` : ''}
                    </span>
                </div>

                {tags.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="mr-1 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                            <TagIcon size={10} />
                            Теги
                        </span>

                        <button
                            type="button"
                            onClick={() => setTagFilter('ALL')}
                            aria-pressed={tagFilter === 'ALL'}
                            className="tab !h-7 !px-2.5 text-[10.5px]"
                        >
                            Все
                        </button>

                        {tags.map((tag) => {
                            const active = Number(tagFilter) === Number(tag.id)
                            const hex = tagColorHex(tag.color)

                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => setTagFilter(active ? 'ALL' : String(tag.id))}
                                    aria-pressed={active}
                                    className="tab !h-7 !px-2.5 text-[10.5px]"
                                >
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: hex }}
                                        aria-hidden="true"
                                    />
                                    {tag.name}
                                </button>
                            )
                        })}
                    </div>
                ) : null}
            </section>

            {tasks.length === 0 && status !== 'loading' ? (
                <EmptyState
                    icon={TasksIcon}
                    title="Задач пока нет"
                    hint="Создайте первую задачу и запустите сессию."
                    action={
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormOpen(true)}>
                            <PlusIcon size={13} />
                            Новая задача
                        </button>
                    }
                />
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={SearchIcon}
                    title="Ничего не найдено"
                    hint="Измените фильтры или поисковый запрос."
                    action={
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                                setQuery('')
                                setStatusFilter('ALL')
                                setDifficultyFilter('ALL')
                                setTagFilter('ALL')
                            }}
                        >
                            <RefreshIcon size={13} />
                            Сбросить
                        </button>
                    }
                />
            ) : (
                <div className="grid gap-3 xl:grid-cols-2">
                    {filtered.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            activeTimer={activeByTask[task.id] ?? null}
                            pending={pendingTaskId === task.id || busyTaskId === task.id}
                            onStart={handleStart}
                            onStop={handleStop}
                            onDone={handleDone}
                            onCancel={(target) => setCancelTarget(target)}
                            onDifficultyChange={handleDifficulty}
                        />
                    ))}
                </div>
            )}

            <TaskFormModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleCreate}
                actions={actions}
                tags={tags}
                onCreateTag={handleCreateTag}
                onOpenLibrary={() => {
                    setFormOpen(false)
                    setLibraryOpen(true)
                }}
            />

            <LibraryModal
                open={libraryOpen}
                onClose={() => setLibraryOpen(false)}
                attributes={attributes}
                actions={actions}
                onCreateAction={handleCreateAction}
            />

            <ConfirmDialog
                open={Boolean(cancelTarget)}
                title="Отменить задачу?"
                message={
                    cancelTarget
                        ? `«${cancelTarget.name}» будет помечена как отменённая. Опыт не начисляется.`
                        : ''
                }
                confirmLabel="Отменить задачу"
                cancelLabel="Назад"
                tone="danger"
                busy={cancelBusy}
                onConfirm={confirmCancel}
                onCancel={() => setCancelTarget(null)}
            />
        </div>
    )
}
