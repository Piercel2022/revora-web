import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Edit3,
  Loader2,
  Store,
  Target,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteOpportunity,
  getOpportunity,
  updateOpportunity,
} from '../api/opportunities'
import { getStores } from '../api/stores'
import { getCustomers } from '../api/customers'

const STATUS_OPTIONS = [
  { value: 'open', label: 'Ouverte' },
  { value: 'won', label: 'Gagnée' },
  { value: 'lost', label: 'Perdue' },
]

const STATUS_STYLES = {
  open: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  won: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  lost: 'bg-red-50 text-red-700 ring-red-600/20',
}

const emptyForm = {
  name: '',
  status: 'open',
  value: '',
  expected_close_at: '',
  store_id: '',
  customer_id: '',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value || 0))
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
  }).format(date)
}

function formatDateInput(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
}

function getStatusLabel(status) {
  return (
    STATUS_OPTIONS.find((option) => option.value === status)?.label ||
    status ||
    'Inconnu'
  )
}

function getCustomerName(customer) {
  if (!customer) return 'Client inconnu'

  const fullName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(' ')

  return (
    customer.company_name ||
    fullName ||
    customer.email ||
    'Client sans nom'
  )
}

function StatusBadge({ status }) {
  const className =
    STATUS_STYLES[status] ||
    'bg-slate-50 text-slate-700 ring-slate-600/20'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
      {getStatusLabel(status)}
    </span>
  )
}

function DetailItem({ icon: Icon, label, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <div className="mt-2 text-sm font-semibold text-slate-900">
        {children}
      </div>
    </div>
  )
}

export default function OpportunityDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [opportunity, setOpportunity] = useState(null)
  const [stores, setStores] = useState([])
  const [customers, setCustomers] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getOpportunity(id),
      getStores(),
      getCustomers(),
    ])
      .then(([opportunityData, storesData, customersData]) => {
        if (cancelled) return

        setOpportunity(opportunityData)
        setStores(Array.isArray(storesData) ? storesData : [])
        setCustomers(Array.isArray(customersData) ? customersData : [])
      })
      .catch((requestError) => {
        if (cancelled) return

        setError(
          requestError.response?.data?.error ||
            requestError.response?.data?.message ||
            'Impossible de charger cette opportunité.',
        )
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const store = stores.find(
    (item) => item.id === opportunity?.store_id,
  )

  const customer = customers.find(
    (item) => item.id === opportunity?.customer_id,
  )

  const handleOpenEdit = () => {
    if (!opportunity) return

    setForm({
      name: opportunity.name || '',
      status: opportunity.status || 'open',
      value: opportunity.value ?? '',
      expected_close_at: formatDateInput(
        opportunity.expected_close_at,
      ),
      store_id: opportunity.store_id || '',
      customer_id: opportunity.customer_id || '',
    })

    setError('')
    setIsEditOpen(true)
  }

  const handleCloseEdit = () => {
    if (isSaving) return

    setIsEditOpen(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError("Le nom de l'opportunité est obligatoire.")
      return
    }

    if (Number(form.value || 0) < 0) {
      setError('La valeur doit être positive ou nulle.')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const updatedOpportunity = await updateOpportunity(id, {
        name: form.name.trim(),
        status: form.status,
        value: Number(form.value || 0),
        expected_close_at: form.expected_close_at
          ? new Date(
              `${form.expected_close_at}T00:00:00`,
            ).toISOString()
          : null,
        store_id: form.store_id || null,
        customer_id: form.customer_id || null,
      })

      setOpportunity(updatedOpportunity)
      setIsEditOpen(false)
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          'Impossible de modifier cette opportunité.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')

    try {
      await deleteOpportunity(id)
      navigate('/opportunities')
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          "Impossible de supprimer cette opportunité.",
      )
      setIsDeleting(false)
      setIsDeleteOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement de l'opportunité...
          </div>
        </div>
      </div>
    )
  }

  if (error && !opportunity) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux opportunités
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error || 'Opportunité introuvable.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux opportunités
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>

          <button
            type="button"
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Edit3 className="h-4 w-4" />
            Modifier
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Target className="h-7 w-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                    {opportunity.name}
                  </h1>

                  <StatusBadge status={opportunity.status} />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Opportunité commerciale
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white px-5 py-4 ring-1 ring-inset ring-slate-200">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Valeur
              </p>

              <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-950">
                <CircleDollarSign className="h-5 w-5 text-slate-400" />
                {formatCurrency(opportunity.value)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem icon={Store} label="Store">
              {store?.name || 'Store inconnu'}
            </DetailItem>

            <DetailItem icon={User} label="Client">
              {getCustomerName(customer)}
            </DetailItem>

            <DetailItem icon={CalendarDays} label="Date de clôture prévue">
              {formatDate(opportunity.expected_close_at)}
            </DetailItem>

            <DetailItem icon={Target} label="Statut">
              {getStatusLabel(opportunity.status)}
            </DetailItem>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Modifier l'opportunité
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Mettez à jour les informations commerciales.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="opportunity-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Nom
                </label>
                <input
                  id="opportunity-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="opportunity-status"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Statut
                  </label>
                  <select
                    id="opportunity-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="opportunity-value"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Valeur
                  </label>
                  <input
                    id="opportunity-value"
                    name="value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.value}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="opportunity-close-date"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Date de clôture prévue
                </label>
                <input
                  id="opportunity-close-date"
                  name="expected_close_at"
                  type="date"
                  value={form.expected_close_at}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="opportunity-store"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Store
                </label>
                <select
                  id="opportunity-store"
                  name="store_id"
                  value={form.store_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">Aucun store</option>
                  {stores.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="opportunity-customer"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Client
                </label>
                <select
                  id="opportunity-customer"
                  name="customer_id"
                  value={form.customer_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">Aucun client</option>
                  {customers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {getCustomerName(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Supprimer cette opportunité ?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cette action supprimera définitivement l'opportunité{' '}
              <strong className="font-semibold text-slate-700">
                {opportunity.name}
              </strong>
              .
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
