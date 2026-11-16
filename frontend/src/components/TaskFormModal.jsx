import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { AlertIcon, LayersIcon, PlusIcon, TagIcon } from './icons'
import {
  DIFFICULTY_META,
  DIFFICULTY_ORDER,
  TAG_COLOR_LABELS,
  TAG_COLOR_ORDER,
  tagColorHex,
} from '../lib/meta'
import { fromLocalInput, toLocalInputValue } from '../lib/format'
import { getErrorMessage } from '../api/client'

const EMPTY_FORM = {
  name: '',
  description: '',
  difficulty: 'MEDIUM',
  actionId: '',
  scheduledAt: '',
  deadline: '',
  tagIds: [],
}

function toFormState(task, fallbackActionId) {
  if (!task) {
    return { ...EMPTY_FORM, actionId: fallbackActionId != null ? String(fallbackActionId) : '' }
  }
  return {
    name: task.name ?? '',
    description: task.description ?? '',
    difficulty: task.difficulty && DIFFICULTY_META[task.difficulty] ? task.difficulty : 'MEDIUM',
    actionId: task.actionId != null ? String(task.actionId) : '',
    scheduledAt: toLocalInputValue(task.scheduledAt),
    deadline: toLocalInputValue(task.deadline),
    tagIds: Array.isArray(task.tagsId) ? task.tagsId.map(Number) : [],
  }
}

export default function TaskFormModal({
  open,
  onClose,
  onSubmit,
  actions = [],
  onOpenLibrary,
  tags = [],
  onCreateTag,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [busy, setBusy] = useState(false)

  const [tagName, setTagName] = useState('')
  const [tagColor, setTagColor] = useState(TAG_COLOR_ORDER[0])
  const [tagBusy, setTagBusy] = useState(false)
  const [tagError, setTagError] = useState(null)

  const firstActionId = actions[0]?.id ?? null

  useEffect(() => {
    if (!open) return
    setForm(toFormState(null, firstActionId))
    setErrors({})
    setSubmitError(null)
    setBusy(false)
    setTagName('')
    setTagError(null)
    setTagBusy(false)
  }, [open, firstActionId])

  const update = (field) => (event) => {
    const value = event.target.value
    setForm((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => (previous[field] ? { ...previous, [field]: null } : previous))
    if (submitError) setSubmitError(null)
  }

  const toggleTag = (tagId) => {
    const id = Number(tagId)
    setForm((previous) => ({
      ...previous,
      tagIds: previous.tagIds.includes(id)
        ? previous.tagIds.filter((value) => value !== id)
        : [...previous.tagIds, id],
    }))
  }

  async function handleAddTag() {
    if (tagBusy || !onCreateTag) return

    const name = tagName.trim()
    if (!name) {
      setTagError('Введите название тега.')
      return
    }
    if (tags.some((tag) => String(tag.name).toLowerCase() === name.toLowerCase())) {
      setTagError('Такой тег уже есть.')
      return
    }

    setTagBusy(true)
    setTagError(null)

    try {
      const created = await onCreateTag({ name, color: tagColor })
      const createdId = created?.id ?? created?.data?.id
      if (createdId != null) {
        setForm((previous) => ({
          ...previous,
          tagIds: Array.from(new Set([...previous.tagIds, Number(createdId)])),
        }))
      }
      setTagName('')
    } catch (error) {
      setTagError(getErrorMessage(error))
    } finally {
      setTagBusy(false)
    }
  }

  const deadlineHint = useMemo(() => {
    if (!form.deadline || !form.scheduledAt) return null
    return new Date(form.deadline).getTime() < new Date(form.scheduledAt).getTime()
      ? 'Дедлайн не может быть раньше начала.'
      : null
  }, [form.deadline, form.scheduledAt])

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return

    const nextErrors = {}
    const name = form.name.trim()
    if (!name) nextErrors.name = 'Введите название задачи.'
    if (!form.actionId) nextErrors.actionId = 'Выберите действие.'
    if (deadlineHint) nextErrors.deadline = deadlineHint
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setBusy(true)
    setSubmitError(null)

    try {
      await onSubmit({
        name,
        description: form.description.trim() || null,
        difficulty: form.difficulty,
        actionId: Number(form.actionId),
        scheduledAt: fromLocalInput(form.scheduledAt),
        deadline: fromLocalInput(form.deadline),
        tagsId: form.tagIds,
      })
      onClose?.()
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Новая задача"
      subtitle="Опишите задачу и выберите действие, за которое начисляется опыт."
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Отмена
          </button>
          <button type="submit" form="task-form" className="btn btn-primary" disabled={busy}>
            {busy ? 'Создаём…' : 'Создать задачу'}
          </button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="task-name">
            Название
          </label>
          <input
            id="task-name"
            className="input mt-1.5 w-full"
            value={form.name}
            onChange={update('name')}
            placeholder="Например, разобрать бэклог"
            autoComplete="off"
            autoFocus
          />
          {errors.name ? <p className="mt-1.5 text-[11px]" style={{ color: 'var(--c-negative)' }}>{errors.name}</p> : null}
        </div>

        <div>
          <label className="label" htmlFor="task-description">
            Описание
          </label>
          <textarea
            id="task-description"
            className="input mt-1.5 min-h-[76px] w-full resize-none py-2.5 leading-relaxed"
            value={form.description}
            onChange={update('description')}
            placeholder="Детали, критерии готовности"
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="label" htmlFor="task-difficulty">
              Сложность
            </label>
            <select
              id="task-difficulty"
              className="input mt-1.5 w-full"
              value={form.difficulty}
              onChange={update('difficulty')}
            >
              {DIFFICULTY_ORDER.map((key) => (
                <option key={key} value={key}>
                  {DIFFICULTY_META[key].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="task-action">
              Действие
            </label>
            {actions.length > 0 ? (
              <select
                id="task-action"
                className="input mt-1.5 w-full"
                value={form.actionId}
                onChange={update('actionId')}
              >
                <option value="">Выберите</option>
                {actions.map((action) => (
                  <option key={action.id} value={action.id}>
                    {action.name}
                  </option>
                ))}
              </select>
            ) : (
              <button
                type="button"
                onClick={onOpenLibrary}
                className="mt-1.5 flex w-full items-center justify-center gap-2 radius-theme border border-dashed px-3 py-2 text-[11.5px] font-semibold transition hover:border-transparent"
                style={{
                  borderColor: 'var(--c-line)',
                  color: 'var(--c-accent)',
                  backgroundColor: 'var(--c-accent-soft)',
                }}
              >
                <PlusIcon size={13} />
                Создать действие
              </button>
            )}
          </div>
        </div>

        {errors.actionId ? <p className="text-[11px]" style={{ color: 'var(--c-negative)' }}>{errors.actionId}</p> : null}

        {actions.length > 0 ? (
          <button
            type="button"
            onClick={onOpenLibrary}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold transition"
            style={{ color: 'var(--c-accent)' }}
          >
            <LayersIcon size={12} />
            Управление действиями
          </button>
        ) : null}

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="label" htmlFor="task-scheduled">
              Начало
            </label>
            <input
              id="task-scheduled"
              type="datetime-local"
              className="input mt-1.5 w-full"
              value={form.scheduledAt}
              onChange={update('scheduledAt')}
            />
          </div>

          <div>
            <label className="label" htmlFor="task-deadline">
              Дедлайн
            </label>
            <input
              id="task-deadline"
              type="datetime-local"
              className="input mt-1.5 w-full"
              value={form.deadline}
              onChange={update('deadline')}
            />
          </div>
        </div>

        <div>
          <label className="label">Теги</label>

          {tags.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const selected = form.tagIds.includes(Number(tag.id))
                const hex = tagColorHex(tag.color)

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    aria-pressed={selected}
                    className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-bold transition"
                    style={{
                      borderColor: 'var(--c-ink)',
                      borderWidth: 'var(--border-width, 1px)',
                      borderRadius: 'var(--radius, 8px)',
                      backgroundColor: selected ? hex : 'transparent',
                      color: selected ? '#141018' : 'var(--c-muted)',
                      boxShadow: selected ? 'var(--shadow)' : 'none',
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full border"
                      style={{ borderColor: 'var(--c-ink)', backgroundColor: hex }}
                    />
                    {tag.name}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="mt-1.5 text-[11px] text-muted">Тегов пока нет — создайте первый ниже.</p>
          )}

          {onCreateTag ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <div className="relative min-w-0 flex-1">
                <TagIcon
                  size={12}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--c-muted)' }}
                />
                <input
                  className="input h-[32px] w-full pl-7 text-[11.5px]"
                  value={tagName}
                  onChange={(event) => {
                    setTagName(event.target.value)
                    setTagError(null)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Новый тег"
                  aria-label="Название нового тега"
                  maxLength={40}
                />
              </div>

              <div className="flex items-center gap-1">
                {TAG_COLOR_ORDER.map((color) => {
                  const selected = color === tagColor

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTagColor(color)}
                      aria-label={TAG_COLOR_LABELS[color] || color}
                      title={TAG_COLOR_LABELS[color] || color}
                      className="h-[18px] w-[18px] border transition"
                      style={{
                        borderColor: selected ? 'var(--c-ink)' : 'var(--c-line)',
                        borderWidth: 'var(--border-width, 1px)',
                        borderRadius: 'calc(var(--radius, 8px) * 0.45)',
                        backgroundColor: tagColorHex(color),
                        transform: selected ? 'scale(1.15)' : 'none',
                      }}
                    />
                  )
                })}
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddTag}
                disabled={tagBusy}
              >
                <PlusIcon size={12} />
                {tagBusy ? 'Добавляем…' : 'Добавить'}
              </button>
            </div>
          ) : null}

          {tagError ? (
            <p className="mt-1.5 text-[11px]" style={{ color: 'var(--c-negative)' }}>{tagError}</p>
          ) : null}
        </div>

        {errors.deadline ? (
          <p className="text-[11px]" style={{ color: 'var(--c-negative)' }}>{errors.deadline}</p>
        ) : null}

        {submitError ? (
          <p className="flex items-start gap-2 radius-theme px-3 py-2 text-[11.5px] leading-snug" style={{ backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-negative)' }}>
            <AlertIcon size={14} className="mt-0.5 shrink-0" />
            {submitError}
          </p>
        ) : null}
      </form>
    </Modal>
  )
}
