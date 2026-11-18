import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuthStore } from '../stores/authStore'

export default function Register() {
  const navigate = useNavigate()

  const busy = useAuthStore((state) => state.busy)
  const storeError = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  const [form, setForm] = useState({ nickname: '', email: '', password: '', repeat: '' })
  const [fieldError, setFieldError] = useState(null)

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }))
    setFieldError(null)
    if (storeError) clearError()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return

    const nickname = form.nickname.trim()
    const email = form.email.trim()

    if (nickname.length < 2) {
      setFieldError('Никнейм должен быть не короче 2 символов.')
      return
    }
    if (!email.includes('@') || email.length < 5) {
      setFieldError('Введите корректную почту.')
      return
    }
    if (form.password.length < 4) {
      setFieldError('Пароль должен быть не короче 4 символов.')
      return
    }
    if (form.password !== form.repeat) {
      setFieldError('Пароли не совпадают.')
      return
    }

    try {
      await useAuthStore.getState().register({ nickname, email, password: form.password })
      navigate('/', { replace: true })
    } catch {
      /* the store already exposes the message */
    }
  }

  return (
    <AuthShell
      eyebrow="Регистрация"
      title="Создать аккаунт"
      subtitle="Профиль, уровни и достижения создаются автоматически вместе с аккаунтом."
      error={fieldError || storeError}
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-semibold underline-offset-2 hover:underline" style={{ color: 'var(--c-accent)' }}>
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
        <div>
          <label htmlFor="register-nickname" className="label">
            Никнейм
          </label>
          <input
            id="register-nickname"
            type="text"
            className="input w-full"
            value={form.nickname}
            onChange={update('nickname')}
            placeholder="Как вас называть"
            autoComplete="nickname"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="register-email" className="label">
            Почта
          </label>
          <input
            id="register-email"
            type="email"
            className="input w-full"
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="register-password" className="label">
              Пароль
            </label>
            <input
              id="register-password"
              type="password"
              className="input w-full"
              value={form.password}
              onChange={update('password')}
              placeholder="Минимум 4 символа"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="register-repeat" className="label">
              Повтор
            </label>
            <input
              id="register-repeat"
              type="password"
              className="input w-full"
              value={form.repeat}
              onChange={update('repeat')}
              placeholder="Ещё раз"
              autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-2 w-full" disabled={busy}>
          {busy ? 'Создаём…' : 'Создать аккаунт'}
        </button>
      </form>
    </AuthShell>
  )
}
