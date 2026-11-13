import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuthStore } from '../stores/authStore'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const busy = useAuthStore((state) => state.busy)
  const storeError = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldError, setFieldError] = useState(null)

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }))
    setFieldError(null)
    if (storeError) clearError()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return

    const email = form.email.trim()
    if (!email) {
      setFieldError('Введите почту.')
      return
    }
    if (!form.password) {
      setFieldError('Введите пароль.')
      return
    }

    try {
      await useAuthStore.getState().login({ email, password: form.password })
      const from = location.state?.from
      navigate(from && from !== '/login' ? from : '/', { replace: true })
    } catch {
      /* the store already exposes the message */
    }
  }

  return (
    <AuthShell
      eyebrow="Вход"
      title="С возвращением"
      subtitle="Войдите, чтобы продолжить работу с задачами, сессиями и опытом."
      error={fieldError || storeError}
      footer={
        <>
          Нет аккаунта?{' '}
          <Link to="/register" className="font-bold underline decoration-2 underline-offset-2" style={{ color: 'var(--c-accent)' }}>
            Создать
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
        <div>
          <label htmlFor="login-email" className="label">
            Почта
          </label>
          <input
            id="login-email"
            type="email"
            className="input mt-1.5 w-full"
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="login-password" className="label">
            Пароль
          </label>
          <input
            id="login-password"
            type="password"
            className="input mt-1.5 w-full"
            value={form.password}
            onChange={update('password')}
            placeholder="Пароль"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-2 w-full" disabled={busy}>
          {busy ? 'Входим…' : 'Войти'}
        </button>
      </form>
    </AuthShell>
  )
}
