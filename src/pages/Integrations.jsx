import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Cable,
  CreditCard,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import apiClient from '../api/client'
import useAuth from '../hooks/useAuth'

const initialForm = {
  store_id: '',
  provider: 'shopify',
  kind: 'store',
  name: '',
  status: 'active',
  external_id: '',
}

const providerLabels = {
  shopify: 'Shopify',
  woocommerce: 'WooCommerce',
  prestashop: 'PrestaShop',
}

const kindLabels = {
  store: 'Store',
  payment: 'Paiement',
  shipping: 'Livraison',
  marketing: 'Marketing',
  analytics: 'Analytics',
}

const statusLabels = {
  active: 'Actif',
  inactive: 'Inactif',
  error: 'Erreur',
}

const providerIcons = {
  shopify: ShoppingBag,
  woocommerce: Store,
  prestashop: Store,
}

const kindIcons = {
  store: Store,
  payment: CreditCard,
  shipping: Truck,
  marketing: BarChart3,
  analytics: BarChart3,
}

function StatusBadge({ status }) {
  const config = {
    active: {
      className: 'bg-emerald-50 text-emerald-700',
      icon: CheckCircle2,
    },
    inactive: {
      className: 'bg-slate-100 text-slate-600',
      icon: CircleAlert,
    },
    error: {
      className: 'bg-red-50 text-red-700',
      icon: AlertCircle,
    },
  }

  const current = config[status] || {
    className: 'bg-slate-100 text-slate-600',
    icon: CircleAlert,
  }

  const Icon = current.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      <Icon size={13} />
      {statusLabels[status] || status || 'Inconnu'}
    </span>
  )
}

function ProviderBadge({ provider }) {
  const Icon = providerIcons[provider] || Cable

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
      <Icon size={14} />
      {providerLabels[provider] || provider || 'Provider inconnu'}
    </div>
  )
}

export default function Integrations() {
  const { organization } = useAuth()

  const [integrations, setIntegrations] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [storesLoading, setStoresLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [kindFilter, setKindFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formError, setFormError] = useState('')

  const loadIntegrations = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.get('/integrations')

      setIntegrations(
        Array.isArray(response.data) ? response.data : [],
      )
    } catch (requestError) {
      console.error('Failed to load integrations:', requestError)

      setError(
        requestError.response?.data?.error ||
          'Impossible de charger les intégrations.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadIntegrations()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const filteredIntegrations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return integrations.filter((integration) => {
      const matchesStatus =
        statusFilter === 'all' || integration.status === statusFilter

      const matchesKind =
        kindFilter === 'all' || integration.kind === kindFilter

      const searchableValues = [
        integration.name,
        integration.provider,
        integration.kind,
        integration.external_id,
      ]

      const matchesSearch =
        !normalizedSearch ||
        searchableValues.some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(normalizedSearch),
        )

      return matchesStatus && matchesKind && matchesSearch
    })
  }, [integrations, search, statusFilter, kindFilter])

  const stats = useMemo(
    () => ({
      total: integrations.length,
      active: integrations.filter(
        (integration) => integration.status === 'active',
      ).length,
      inactive: integrations.filter(
        (integration) => integration.status === 'inactive',
      ).length,
      error: integrations.filter(
        (integration) => integration.status === 'error',
      ).length,
    }),
    [integrations],
  )

  const loadStores = async () => {
    if (stores.length > 0) {
      return
    }

    setStoresLoading(true)

    try {
      const response = await apiClient.get('/stores')

      setStores(Array.isArray(response.data) ? response.data : [])
    } catch (requestError) {
      console.error('Failed to load stores:', requestError)

      setFormError(
        requestError.response?.data?.error ||
          'Impossible de charger les stores.',
      )
    } finally {
      setStoresLoading(false)
    }
  }

  const openCreateForm = async () => {
    setEditingIntegration(null)
    setForm(initialForm)
    setFormError('')
    setIsFormOpen(true)

    await loadStores()
  }

  const openEditForm = async (integration) => {
    setEditingIntegration(integration)

    setForm({
      store_id: integration.store_id || '',
      provider: integration.provider || 'shopify',
      kind: integration.kind || 'store',
      name: integration.name || '',
      status: integration.status || 'active',
      external_id: integration.external_id || '',
    })

    setFormError('')
    setIsFormOpen(true)

    await loadStores()
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setIsFormOpen(false)
    setEditingIntegration(null)
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
      setFormError("Le nom de l'intégration est obligatoire.")
      return
    }

    if (!organization?.id && !editingIntegration) {
      setFormError("L'organisation active est introuvable.")
      return
    }

    setSaving(true)

    try {
      const payload = {
        integration: {
          name,
          provider: form.provider,
          kind: form.kind,
          status: form.status,
          external_id: form.external_id.trim() || null,
          store_id: form.store_id || null,
          ...(editingIntegration
            ? {}
            : { organization_id: organization.id }),
        },
      }

      if (editingIntegration) {
        const response = await apiClient.patch(
          `/integrations/${editingIntegration.id}`,
          payload,
        )

        setIntegrations((current) =>
          current.map((integration) =>
            integration.id === editingIntegration.id
              ? response.data
              : integration,
          ),
        )
      } else {
        const response = await apiClient.post('/integrations', payload)

        setIntegrations((current) => [
          response.data,
          ...current,
        ])
      }

      closeForm()
    } catch (requestError) {
      console.error('Failed to save integration:', requestError)

      const validationErrors = requestError.response?.data?.errors

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFormError(validationErrors.join(', '))
      } else {
        setFormError(
          requestError.response?.data?.error ||
            "Impossible d'enregistrer l'intégration.",
        )
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (integration) => {
    const confirmed = window.confirm(
      `Supprimer définitivement l'intégration « ${integration.name} » ?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingId(integration.id)
    setError('')

    try {
      await apiClient.delete(`/integrations/${integration.id}`)

      setIntegrations((current) =>
        current.filter((item) => item.id !== integration.id),
      )
    } catch (requestError) {
      console.error('Failed to delete integration:', requestError)

      setError(
        requestError.response?.data?.error ||
          "Impossible de supprimer l'intégration.",
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
              <Cable size={21} />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Integrations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Connectez Revora à votre écosystème e-commerce et
              centralisez vos connexions métier.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Nouvelle intégration
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Actives
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats.active}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Inactives
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats.inactive}
            </p>
          </div>

          <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-400">
              Erreurs
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {stats.error}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative min-w-0 flex-1 xl:max-w-md">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher une intégration..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  ['all', 'Tous'],
                  ['active', 'Actives'],
                  ['inactive', 'Inactives'],
                  ['error', 'Erreurs'],
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

                <select
                  value={kindFilter}
                  onChange={(event) => setKindFilter(event.target.value)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition focus:border-slate-400"
                >
                  <option value="all">Tous les types</option>
                  <option value="store">Stores</option>
                  <option value="payment">Paiements</option>
                  <option value="shipping">Livraison</option>
                  <option value="marketing">Marketing</option>
                  <option value="analytics">Analytics</option>
                </select>

                <button
                  type="button"
                  onClick={loadIntegrations}
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
              <AlertCircle size={18} className="mt-0.5 shrink-0" />

              <span className="flex-1">{error}</span>

              <button
                type="button"
                onClick={loadIntegrations}
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
                Chargement des intégrations...
              </div>
            </div>
          ) : filteredIntegrations.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <Cable size={21} />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-slate-900">
                {integrations.length === 0
                  ? 'Aucune intégration'
                  : 'Aucune intégration correspondante'}
              </h2>

              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                {integrations.length === 0
                  ? 'Connectez votre première plateforme ou votre premier service à Revora.'
                  : 'Modifiez votre recherche ou vos filtres pour afficher les intégrations disponibles.'}
              </p>

              {integrations.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Ajouter une intégration
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Intégration
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Type
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Store
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Identifiant externe
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
                  {filteredIntegrations.map((integration) => {
                    const isDeleting =
                      deletingId === integration.id

                    const KindIcon =
                      kindIcons[integration.kind] || Cable

                    return (
                      <tr
                        key={integration.id}
                        className="group transition hover:bg-slate-50/70"
                      >
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              <Cable size={17} />
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {integration.name}
                              </div>

                              <div className="mt-1">
                                <ProviderBadge
                                  provider={integration.provider}
                                />
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <KindIcon
                              size={15}
                              className="text-slate-400"
                            />
                            {kindLabels[integration.kind] ||
                              integration.kind ||
                              'Inconnu'}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {integration.store_id ? (
                            <span className="text-sm font-medium text-slate-700">
                              {stores.find(
                                (store) =>
                                  store.id === integration.store_id,
                              )?.name || 'Store associé'}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Tous les stores
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="font-mono text-xs text-slate-500">
                            {integration.external_id || '—'}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <StatusBadge status={integration.status} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(integration)
                              }
                              title="Modifier"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(integration)
                              }
                              disabled={isDeleting}
                              title="Supprimer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
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
                  {editingIntegration
                    ? "Modifier l'intégration"
                    : 'Nouvelle intégration'}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Configurez la connexion à votre écosystème
                  e-commerce.
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
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="integration-name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Nom
                  </label>

                  <input
                    id="integration-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ex. Shopify Store Sync"
                    autoFocus
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="integration-provider"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Provider
                    </label>

                    <select
                      id="integration-provider"
                      name="provider"
                      value={form.provider}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    >
                      <option value="shopify">Shopify</option>
                      <option value="woocommerce">
                        WooCommerce
                      </option>
                      <option value="prestashop">
                        PrestaShop
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="integration-kind"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Type
                    </label>

                    <select
                      id="integration-kind"
                      name="kind"
                      value={form.kind}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    >
                      <option value="store">Store</option>
                      <option value="payment">Paiement</option>
                      <option value="shipping">Livraison</option>
                      <option value="marketing">Marketing</option>
                      <option value="analytics">Analytics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="integration-store"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Store associé
                  </label>

                  <select
                    id="integration-store"
                    name="store_id"
                    value={form.store_id}
                    onChange={handleChange}
                    disabled={storesLoading}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-50"
                  >
                    <option value="">
                      Aucun store spécifique
                    </option>

                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>

                  {storesLoading && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Chargement des stores...
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="integration-external-id"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Identifiant externe
                    </label>

                    <input
                      id="integration-external-id"
                      name="external_id"
                      type="text"
                      value={form.external_id}
                      onChange={handleChange}
                      placeholder="Ex. shopify-prod-01"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="integration-status"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Statut
                    </label>

                    <select
                      id="integration-status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                      <option value="error">Erreur</option>
                    </select>
                  </div>
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
                  {saving && (
                    <Loader2 size={16} className="animate-spin" />
                  )}

                  {editingIntegration
                    ? 'Enregistrer'
                    : "Créer l'intégration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}