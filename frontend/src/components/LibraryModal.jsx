import { useEffect, useState } from 'react'
import Modal from './Modal'
import EmptyState from './EmptyState'
import { AlertIcon, LayersIcon, PlusIcon, SparkIcon } from './icons'
import { attributeColor, attributeLabel } from '../lib/meta'
import { formatNumber } from '../lib/format'
import { getErrorMessage } from '../api/client'

function distribute(attributes, selectedIds) {
  const chosen = attributes.filter((attribute) => selectedIds.includes(attribute.attributeId))
  if (chosen.length === 0) return []

  const base = Math.floor((1 / chosen.length) * 100) / 100

  return chosen.map((attribute, index) => ({
    attributeId: attribute.attributeId,
        weight: index === chosen.length - 1 ? Number((1 - base * (chosen.length - 1)).toFixed(2)) : base,
  }))
}

export default function LibraryModal({
  open,
  onClose,
  attributes = [],
  actions = [],
  onCreateAction,
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setName('')
    setDescription('')
    setSelectedIds(attributes.map((attribute) => attribute.attributeId))
    setError(null)
    setBusy(false)
  }, [open, attributes])

  const weights = distribute(attributes, selectedIds)

  function toggle(attributeId) {
    setSelectedIds((previous) =>
      previous.includes(attributeId)
        ? previous.filter((id) => id !== attributeId)
        : [...previous, attributeId],
    )
    if (error) setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return

    const trimmed = name.trim()
    if (!trimmed) {
      setError('Введите название действия.')
      return
    }
    if (weights.length === 0) {
      setError('Выберите хотя бы один атрибут.')
      return
    }

    setBusy(true)
    setError(null)

    try {
      await onCreateAction({
        name: trimmed,
        description: description.trim() || null,
        attributes: weights,
      })
      setName('')
      setDescription('')
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Библиотека"
      subtitle="Действия определяют, какие атрибуты получают опыт."
      size="lg"
      footer={
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Готово
        </button>
      }
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="min-w-0">
          <p className="section-title">Действия</p>

          {actions.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={LayersIcon}
                title="Пока пусто"
                hint="Создайте первое действие."
              />
            </div>
          ) : (
            <ul className="scroll-area mt-3 max-h-[340px] space-y-2 overflow-y-auto pr-1">
              {actions.map((action) => (
                <li
                  key={action.id}
                  className="px-3 py-2.5"
                  style={{ borderRadius: 'var(--radius-sm, 12px)', backgroundColor: 'var(--c-sunken)' }}
                >
                  <div className="flex items-center gap-2">
                    <SparkIcon size={13} style={{ color: 'var(--c-accent)' }} />
                    <p className="line-clamp-1 text-[12.5px] font-semibold text-ink">{action.name}</p>
                  </div>
                  {action.description ? (
                    <p className="mt-1 line-clamp-2 pl-[21px] text-[11px] leading-relaxed text-muted">
                      {action.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="min-w-0">
          <p className="section-title">Новое действие</p>

          <div className="mt-3 space-y-3">
            <input
              className="input w-full"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (error) setError(null)
              }}
              placeholder="Название"
              aria-label="Название действия"
              autoComplete="off"
            />

            <textarea
              className="input min-h-[56px] w-full resize-none py-2 leading-relaxed"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Описание"
              aria-label="Описание действия"
            />

            <div>
              <div className="flex items-center justify-between">
                <span className="label">Атрибуты</span>
                <span className="text-[10px] font-medium text-muted">
                  {weights.length > 0
                    ? `${weights.length} · ${formatNumber(weights.reduce((sum, item) => sum + item.weight, 0), 2)}`
                    : '—'}
                </span>
              </div>

              {attributes.length === 0 ? (
                <p className="mt-2 text-[11px]" style={{ color: 'var(--c-muted)' }}>
                  Атрибуты недоступны.
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {attributes.map((attribute, index) => {
                    const active = selectedIds.includes(attribute.attributeId)
                    const color = attributeColor(attribute.name, index)

                    return (
                      <button
                        key={attribute.attributeId}
                        type="button"
                        onClick={() => toggle(attribute.attributeId)}
                        aria-pressed={active}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10.5px] font-medium transition"
                        style={{
                          border: '1px solid',
                          borderColor: active ? `color-mix(in srgb, ${color} 55%, transparent)` : 'var(--c-line)',
                          borderRadius: 'calc(var(--radius-sm, 12px) * 0.7)',
                          backgroundColor: active ? `color-mix(in srgb, ${color} 20%, transparent)` : 'transparent',
                          color: active ? 'var(--c-ink)' : 'var(--c-muted)',
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: active ? color : 'var(--c-line)' }}
                        />
                        {attributeLabel(attribute.name)}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {error ? (
            <p
              className="mt-3 flex items-start gap-2 px-3 py-2 text-[11px] leading-snug"
              style={{
                borderRadius: 'var(--radius-sm, 12px)',
                backgroundColor: 'color-mix(in srgb, var(--c-negative) 12%, transparent)',
                color: 'var(--c-negative)',
              }}
            >
              <AlertIcon size={14} className="mt-0.5 shrink-0" />
              {error}
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary mt-4 w-full" disabled={busy}>
            <PlusIcon size={13} />
            {busy ? 'Сохраняем…' : 'Создать действие'}
          </button>
        </form>
      </div>
    </Modal>
  )
}
