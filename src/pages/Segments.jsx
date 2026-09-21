import { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  Boxes,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import apiClient from '../api/client'
import useAuth from '../hooks/useAuth'

const initialForm = {
  name: '',
  description: '',
  status: 'active',
}

const statusLabels = {
  active: 'Actif',
  archived: 'Archivé',
}

export default function Segments() {
  const { organization } = useAuth()

  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSegment, setEditingSegment] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formError, setFormError] = useState('')

  const loadSegments = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.get('/segments')
      setSegments(Array.isArray(response.data) ? response.data : [])
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          'Impossible de charger les segments.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSegments()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const filteredSegments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return segments.filter((segment) => {
      const matchesStatus =
        statusFilter === 'all' || segment.status === statusFilter

      const matchesSearch =
        !normalizedSearch ||
        segment.name?.toLowerCase().includes(normalizedSearch) ||
        segment.description?.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [segments, search, statusFilter])

  const activeCount = segments.filter(
    (segment) => segment.status === 'active',
  ).length

  const archivedCount = segments.filter(
    (segment) => segment.status === 'archived',
  ).length

  const openCreateForm = () => {
    setEditingSegment(null)
    setForm(initialForm)
    setFormError('')
    setIsFormOpen(true)
  }

  const openEditForm = (segment) => {
    setEditingSegment(segment)
    setForm({
      name: segment.name || '',
      description: segment.description || '',
      status: segment.status || 'active',
    })
    setFormError('')
    setIsFormOpen(true)
  }

  const closeForm = () => {
    if (saving) return

    setIsFormOpen(false)
    setEditingSegment(null)
    setForm(initialForm)
    setFormError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const name = form.name.trim()

    if (!name) {
      setFormError('Le nom du segment est obligatoire.')
      return
    }

    if (!organization?.id && !editingSegment) {
      setFormError("L'organisation active est introuvable.")
      return
    }

    setSaving(true)

    try {
      const payload = {
        segment: {
          name,
          description: form.description.trim(),
          status: form.status,
          ...(editingSegment
            ? {}
            : { organization_id: organization.id }),
        },
      }

      if (editingSegment) {
        const response = await apiClient.patch(
          `/segments/${editingSegment.id}`,
          payload,
        )

        setSegments((current) =>
          current.map((segment) =>
            segment.id === editingSegment.id ? response.data : segment,
          ),
        )
      } else {
        const response = await apiClient.post('/segments', payload)

        setSegments((current) => [response.data, ...current])
      }

      closeForm()
    } catch (requestError) {
      const validationErrors = requestError.response?.data?.errors

      if (Array.isArray(validationErrors)) {
        setFormError(validationErrors.join(', '))
      } else {
        setFormError(
          requestError.response?.data?.error ||
            "Impossible d'enregistrer le segment.",
        )
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (segment) => {
    const confirmed = window.confirm(
      `Supprimer définitivement le segment « ${segment.name} » ?`,
    )

    if (!confirmed) return

    setDeletingId(segment.id)
    setError('')

    try {
      await apiClient.delete(`/segments/${segment.id}`)

      setSegments((current) =>
        current.filter((item) => item.id !== segment.id),
      )
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          'Impossible de supprimer le segment.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Boxes size={21} />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Segments
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Organisez vos clients en segments exploitables pour mieux
              structurer votre activité commerciale.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Nouveau segment
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {segments.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Actifs
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Archivés
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {archivedCount}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative min-w-0 flex-1 lg:max-w-md">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un segment..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                {[
                  ['all', 'Tous'],
                  ['active', 'Actifs'],
                  ['archived', 'Archivés'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatusFilter(value)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      statusFilter === value
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={loadSegments}
                  disabled={loading}
                  title="Actualiser"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? 'animate-spin' : ''}
                  />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span className="flex-1">{error}</span>

              <button
                type="button"
                onClick={loadSegments}
                className="font-semibold underline underline-offset-2"
              >
                Réessayer
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={18} className="animate-spin" />
                Chargement des segments...
              </div>
            </div>
          ) : filteredSegments.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <Boxes size={21} />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-slate-900">
                {segments.length === 0
                  ? 'Aucun segment'
                  : 'Aucun segment correspondant'}
              </h2>

              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                {segments.length === 0
                  ? 'Créez votre premier segment pour commencer à structurer votre base clients.'
                  : 'Modifiez votre recherche ou vos filtres pour afficher les segments disponibles.'}
              </p>

              {segments.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Créer un segment
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Segment
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Description
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Statut
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredSegments.map((segment) => {
                    const isDeleting = deletingId === segment.id

                    return (
                      <tr key={segment.id} className="group">
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              <Boxes size={17} />
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {segment.name}
                              </div>

                              <div className="mt-0.5 text-xs text-slate-400">
                                Segment client
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-md px-5 py-4">
                          <p className="truncate text-sm text-slate-500">
                            {segment.description || 'Aucune description'}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              segment.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {segment.status === 'active' ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <Archive size={13} />
                            )}
                            {statusLabels[segment.status] || segment.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditForm(segment)}
                              title="Modifier"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(segment)}
                              disabled={isDeleting}
                              title="Supprimer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-6">
          <div
            className="absolute inset-0"
            onClick={closeForm}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {editingSegment ? 'Modifier le segment' : 'Nouveau segment'}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {editingSegment
                    ? 'Mettez à jour les informations du segment.'
                    : 'Créez un segment pour organiser votre base clients.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-5">
                {formError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="segment-name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Nom
                  </label>

                  <input
                    id="segment-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ex. Clients VIP"
                    autoFocus
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="segment-description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="segment-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Décrivez l'objectif de ce segment..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="segment-status"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Statut
                  </label>

                  <select
                    id="segment-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    <option value="active">Actif</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingSegment ? 'Enregistrer' : 'Créer le segment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
