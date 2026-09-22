import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  CircleDollarSign,
  Edit3,
  Plus,
  Search,
  Target,
  Trash2,
  Trophy,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCustomers } from '../api/customers'
import {
  createOpportunity,
  deleteOpportunity,
  getOpportunities,
  updateOpportunity,
} from '../api/opportunities'
import { getStores } from '../api/stores'
import useAuth from '../hooks/useAuth'

const STATUS_OPTIONS = [
  { value: 'open', label: 'Ouverte' },
  { value: 'won', label: 'Gagnée' },
  { value: 'lost', label: 'Perdue' },
]

const STATUS_STYLES = {
  open: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  won: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  lost: 'bg-slate-100 text-slate-600 ring-slate-500/10',
}

const EMPTY_FORM = {
  store_id: '',
  customer_id: '',
  name: '',
  status: 'open',
  value: '',
  expected_close_at: '',
}

function formatCurrency(value) {
  const amount = Number(value || 0)

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatDateInput(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label || status
}

function getCustomerName(customer) {
  if (!customer) return '—'

  const fullName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(' ')

  return fullName || customer.name || customer.email || 'Client'
}

function getErrorMessage(error, fallback) {
  const errors = error?.response?.data?.errors

  if (Array.isArray(errors) && errors.length > 0) {
    return errors.join(', ')
  }

  if (typeof errors === 'object' && errors !== null) {
    return Object.values(errors).flat().join(', ')
  }

  if (typeof error?.response?.data?.error === 'string') {
    return error.response.data.error
  }

  return fallback
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fermer"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

function Field({ label, required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>

      {children}
    </label>
  )
}

function EmptyState({ onCreate }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
        <Target size={22} />
      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-900">
        Aucune opportunité
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Créez votre première opportunité pour commencer à suivre votre
        pipeline commercial.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <Plus size={17} />
        Nouvelle opportunité
      </button>
    </div>
  )
}

export default function Opportunities() {
  const { organization } = useAuth()
  const organizationId = organization?.id

  const [opportunities, setOpportunities] = useState([])
  const [stores, setStores] = useState([])
  const [customers, setCustomers] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [storeFilter, setStoreFilter] = useState('all')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)


  useEffect(() => {
    let cancelled = false

    async function loadInitialData() {
      setError('')

      try {
        const [opportunitiesData, storesData, customersData] =
          await Promise.all([
            getOpportunities(),
            getStores(),
            getCustomers(),
          ])

        if (cancelled) return

        setOpportunities(
          Array.isArray(opportunitiesData) ? opportunitiesData : [],
        )
        setStores(Array.isArray(storesData) ? storesData : [])
        setCustomers(Array.isArray(customersData) ? customersData : [])
      } catch (requestError) {
        if (cancelled) return

        setError(
          getErrorMessage(
            requestError,
            'Impossible de charger les opportunités.',
          ),
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      cancelled = true
    }
  }, [])

  const organizationStores = useMemo(
    () =>
      stores.filter(
        (store) =>
          !organizationId || store.organization_id === organizationId,
      ),
    [stores, organizationId],
  )

  const organizationCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        if (!organizationId) return true

        const customerStore = stores.find(
          (store) => store.id === customer.store_id,
        )

        return customerStore?.organization_id === organizationId
      }),
    [customers, stores, organizationId],
  )

  const formCustomers = useMemo(() => {
    if (!form.store_id) return organizationCustomers

    return organizationCustomers.filter(
      (customer) => customer.store_id === form.store_id,
    )
  }, [organizationCustomers, form.store_id])

  const storeMap = useMemo(
    () => new Map(organizationStores.map((store) => [store.id, store])),
    [organizationStores],
  )

  const customerMap = useMemo(
    () =>
      new Map(
        organizationCustomers.map((customer) => [customer.id, customer]),
      ),
    [organizationCustomers],
  )

  const filteredOpportunities = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return opportunities.filter((opportunity) => {
      const store = storeMap.get(opportunity.store_id)
      const customer = customerMap.get(opportunity.customer_id)

      const customerName = getCustomerName(customer)

      const matchesSearch =
        !normalizedSearch ||
        opportunity.name?.toLowerCase().includes(normalizedSearch) ||
        store?.name?.toLowerCase().includes(normalizedSearch) ||
        customerName.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        statusFilter === 'all' || opportunity.status === statusFilter

      const matchesStore =
        storeFilter === 'all' || opportunity.store_id === storeFilter

      return matchesSearch && matchesStatus && matchesStore
    })
  }, [
    opportunities,
    storeMap,
    customerMap,
    search,
    statusFilter,
    storeFilter,
  ])

  const kpis = useMemo(() => {
    const total = opportunities.length

    const openOpportunities = opportunities.filter(
      (opportunity) => opportunity.status === 'open',
    )

    const wonOpportunities = opportunities.filter(
      (opportunity) => opportunity.status === 'won',
    )

    const lostOpportunities = opportunities.filter(
      (opportunity) => opportunity.status === 'lost',
    )

    const openValue = openOpportunities.reduce(
      (sum, opportunity) => sum + Number(opportunity.value || 0),
      0,
    )

    const wonValue = wonOpportunities.reduce(
      (sum, opportunity) => sum + Number(opportunity.value || 0),
      0,
    )

    return {
      total,
      openValue,
      wonValue,
      wonCount: wonOpportunities.length,
      lostCount: lostOpportunities.length,
    }
  }, [opportunities])

  function openCreateModal() {
    setEditingOpportunity(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setIsModalOpen(true)
  }

  function openEditModal(opportunity) {
    setEditingOpportunity(opportunity)
    setForm({
      store_id: opportunity.store_id || '',
      customer_id: opportunity.customer_id || '',
      name: opportunity.name || '',
      status: opportunity.status || 'open',
      value:
        opportunity.value === null || opportunity.value === undefined
          ? ''
          : String(opportunity.value),
      expected_close_at: formatDateInput(opportunity.expected_close_at),
    })
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    if (saving) return

    setIsModalOpen(false)
    setEditingOpportunity(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function handleFormChange(event) {
    const { name, value } = event.target

    setForm((current) => {
      if (name === 'store_id') {
        return {
          ...current,
          store_id: value,
          customer_id: '',
        }
      }

      return {
        ...current,
        [name]: value,
      }
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const name = form.name.trim()

    if (!name) {
      setFormError('Le nom de l’opportunité est obligatoire.')
      return
    }

    const numericValue =
      form.value === '' ? 0 : Number(String(form.value).replace(',', '.'))

    if (Number.isNaN(numericValue) || numericValue < 0) {
      setFormError('La valeur doit être un nombre supérieur ou égal à 0.')
      return
    }

    const selectedStore = form.store_id
      ? storeMap.get(form.store_id)
      : null

    const selectedCustomer = form.customer_id
      ? customerMap.get(form.customer_id)
      : null

    if (
      selectedStore &&
      organizationId &&
      selectedStore.organization_id !== organizationId
    ) {
      setFormError(
        'Le magasin sélectionné n’appartient pas à votre organisation.',
      )
      return
    }

    if (
      selectedCustomer &&
      selectedStore &&
      selectedCustomer.store_id !== selectedStore.id
    ) {
      setFormError('Le client sélectionné appartient à un autre magasin.')
      return
    }

    const payload = {
      organization_id:
        editingOpportunity?.organization_id || organizationId,
      store_id: form.store_id || null,
      customer_id: form.customer_id || null,
      name,
      status: form.status,
      value: numericValue,
      expected_close_at: form.expected_close_at || null,
    }

    if (!payload.organization_id) {
      setFormError('Organisation introuvable. Veuillez vous reconnecter.')
      return
    }

    setSaving(true)

    try {
      if (editingOpportunity) {
        const updatedOpportunity = await updateOpportunity(
          editingOpportunity.id,
          payload,
        )

        setOpportunities((current) =>
          current.map((opportunity) =>
            opportunity.id === updatedOpportunity.id
              ? updatedOpportunity
              : opportunity,
          ),
        )
      } else {
        const createdOpportunity = await createOpportunity(payload)

        setOpportunities((current) => [
          createdOpportunity,
          ...current,
        ])
      }

      closeModal()
    } catch (requestError) {
      setFormError(
        getErrorMessage(
          requestError,
          editingOpportunity
            ? 'Impossible de modifier cette opportunité.'
            : 'Impossible de créer cette opportunité.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(opportunity) {
    const confirmed = window.confirm(
      `Supprimer l’opportunité « ${opportunity.name} » ?`,
    )

    if (!confirmed) return

    setDeletingId(opportunity.id)
    setError('')

    try {
      await deleteOpportunity(opportunity.id)

      setOpportunities((current) =>
        current.filter((item) => item.id !== opportunity.id),
      )
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Impossible de supprimer cette opportunité.',
        ),
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Target size={21} />
            </div>

            <div>
              <p className="text-sm font-medium text-violet-600">
                Pipeline commercial
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Opportunités
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Suivez vos opportunités commerciales, leur valeur et leur
            progression jusqu’à la clôture.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Nouvelle opportunité
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total</p>
            <Target size={18} className="text-slate-400" />
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {kpis.total}
          </p>

          <p className="mt-1 text-xs text-slate-400">opportunités</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Pipeline ouvert
            </p>
            <CircleDollarSign size={18} className="text-amber-500" />
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(kpis.openValue)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            valeur des opportunités ouvertes
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Valeur gagnée
            </p>
            <Trophy size={18} className="text-emerald-500" />
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(kpis.wonValue)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            opportunités gagnées
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Gagnées</p>
            <Trophy size={18} className="text-emerald-500" />
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {kpis.wonCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            opportunités gagnées
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Perdues</p>
            <Target size={18} className="text-slate-400" />
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {kpis.lostCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            opportunités perdues
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError('')}
            className="shrink-0 text-rose-400 hover:text-rose-700"
            aria-label="Fermer"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une opportunité, un magasin ou un client..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="all">Tous les statuts</option>

            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={storeFilter}
            onChange={(event) => setStoreFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="all">Tous les magasins</option>

            {organizationStores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            Chargement des opportunités...
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="p-6">
            {opportunities.length === 0 ? (
              <EmptyState onCreate={openCreateModal} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <Search size={21} />
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  Aucun résultat
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Aucune opportunité ne correspond aux filtres actuels.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Opportunité
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Magasin
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Clôture prévue
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Valeur
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Statut
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOpportunities.map((opportunity) => {
                  const store = storeMap.get(opportunity.store_id)
                  const customer = customerMap.get(opportunity.customer_id)

                  return (
                    <tr
                      key={opportunity.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <Link to={`/opportunities/${opportunity.id}`} className="font-semibold text-slate-900 transition hover:text-blue-600" >
  {opportunity.name}
</Link>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {store?.name || '—'}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700">
                          {getCustomerName(customer)}
                        </div>

                        {customer?.email && (
                          <div className="mt-1 text-xs text-slate-400">
                            {customer.email}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />
                          {formatDate(opportunity.expected_close_at)}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrency(opportunity.value)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                            STATUS_STYLES[opportunity.status] ||
                            STATUS_STYLES.open
                          }`}
                        >
                          {getStatusLabel(opportunity.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(opportunity)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`Modifier ${opportunity.name}`}
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(opportunity)}
                            disabled={deletingId === opportunity.id}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Supprimer ${opportunity.name}`}
                          >
                            <Trash2 size={16} />
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

      {isModalOpen && (
        <Modal
          title={
            editingOpportunity
              ? 'Modifier l’opportunité'
              : 'Nouvelle opportunité'
          }
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 p-6">
              {formError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">
                  {formError}
                </div>
              )}

              <Field label="Nom" required>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Ex. Extension abonnement annuel"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  required
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Magasin">
                  <select
                    name="store_id"
                    value={form.store_id}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                  >
                    <option value="">Aucun magasin</option>

                    {organizationStores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Client">
                  <select
                    name="customer_id"
                    value={form.customer_id}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                  >
                    <option value="">Aucun client</option>

                    {formCustomers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {getCustomerName(customer)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Valeur (€)" required>
                  <input
                    type="number"
                    name="value"
                    min="0"
                    step="0.01"
                    value={form.value}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </Field>

                <Field label="Statut" required>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Clôture prévue">
                  <input
                    type="date"
                    name="expected_close_at"
                    value={form.expected_close_at}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                  />
                </Field>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? 'Enregistrement...'
                  : editingOpportunity
                    ? 'Enregistrer'
                    : 'Créer l’opportunité'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
