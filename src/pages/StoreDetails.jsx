import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Pencil,
  Save,
  Store as StoreIcon,
  Trash2,
  WifiOff,
  X,
} from 'lucide-react'
import {
  deleteStore,
  getStore,
  updateStore,
} from '../api/stores'

const initialForm = {
  name: '',
  platform: 'shopify',
  external_id: '',
  currency: 'EUR',
  timezone: 'Europe/Paris',
  status: 'active',
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    icon: CheckCircle2,
  },
  paused: {
    label: 'Paused',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    icon: Clock3,
  },
  disconnected: {
    label: 'Disconnected',
    className: 'bg-red-50 text-red-700 ring-red-600/20',
    icon: WifiOff,
  },
}

const platformLabels = {
  shopify: 'Shopify',
  woocommerce: 'WooCommerce',
  prestashop: 'PrestaShop',
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    className: 'bg-gray-50 text-gray-700 ring-gray-600/20',
    icon: AlertCircle,
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  )
}

function StoreDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [store, setStore] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState([])

  useEffect(() => {
    let cancelled = false

    const initializeStore = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getStore(id)

        if (!cancelled) {
          setStore(data)
          setForm({
            name: data.name || '',
            platform: data.platform || 'shopify',
            external_id: data.external_id || '',
            currency: data.currency || 'EUR',
            timezone: data.timezone || 'Europe/Paris',
            status: data.status || 'active',
          })
        }
      } catch (requestError) {
        console.error('Failed to load store:', requestError)

        if (!cancelled) {
          setError(
            requestError.response?.data?.error ||
              'Unable to load this store.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    initializeStore()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    if (formErrors.length > 0) {
      setFormErrors([])
    }
  }

  const handleCancelEdit = () => {
    if (!store) {
      return
    }

    setForm({
      name: store.name || '',
      platform: store.platform || 'shopify',
      external_id: store.external_id || '',
      currency: store.currency || 'EUR',
      timezone: store.timezone || 'Europe/Paris',
      status: store.status || 'active',
    })

    setFormErrors([])
    setEditing(false)
  }

  const handleUpdate = async (event) => {
    event.preventDefault()

    setSaving(true)
    setFormErrors([])

    try {
      const updatedStore = await updateStore(id, form)

      setStore(updatedStore)
      setForm({
        name: updatedStore.name || '',
        platform: updatedStore.platform || 'shopify',
        external_id: updatedStore.external_id || '',
        currency: updatedStore.currency || 'EUR',
        timezone: updatedStore.timezone || 'Europe/Paris',
        status: updatedStore.status || 'active',
      })
      setEditing(false)
    } catch (requestError) {
      console.error('Failed to update store:', requestError)

      const errors = requestError.response?.data?.errors

      if (Array.isArray(errors)) {
        setFormErrors(errors)
      } else {
        setFormErrors([
          requestError.response?.data?.error ||
            'Unable to update this store.',
        ])
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      await deleteStore(id)
      navigate('/stores')
    } catch (requestError) {
      console.error('Failed to delete store:', requestError)

      setError(
        requestError.response?.data?.error ||
          'Unable to delete this store.',
      )
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          Loading store...
        </div>
      </div>
    )
  }

  if (error && !store) {
    return (
      <div className="flex min-h-96 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={21} />
          </div>

          <h1 className="mt-4 font-semibold text-gray-900">
            Unable to load store
          </h1>

          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <Link
            to="/stores"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <ArrowLeft size={16} />
            Back to stores
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/stores"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to stores
        </Link>

        {!editing && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFormErrors([])
                setEditing(true)
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gray-900 p-3 text-white">
              <StoreIcon size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {store.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                  {platformLabels[store.platform] || store.platform}
                </span>

                <StatusBadge status={store.status} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-6 p-6">
            {formErrors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div className="space-y-1">
                    {formErrors.map((formError) => (
                      <p key={formError} className="text-sm text-red-700">
                        {formError}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="store-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="store-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleFormChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="store-platform"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Platform
                </label>
                <select
                  id="store-platform"
                  name="platform"
                  value={form.platform}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="shopify">Shopify</option>
                  <option value="woocommerce">WooCommerce</option>
                  <option value="prestashop">PrestaShop</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="store-currency"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Currency
                </label>
                <input
                  id="store-currency"
                  name="currency"
                  type="text"
                  value={form.currency}
                  onChange={handleFormChange}
                  required
                  maxLength={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="store-external-id"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                External ID
              </label>
              <input
                id="store-external-id"
                name="external_id"
                type="text"
                value={form.external_id}
                onChange={handleFormChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="store-timezone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Timezone
                </label>
                <input
                  id="store-timezone"
                  name="timezone"
                  type="text"
                  value={form.timezone}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label
                  htmlFor="store-status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="store-status"
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="disconnected">Disconnected</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Store name
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {store.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Platform
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {platformLabels[store.platform] || store.platform}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                External ID
              </p>
              <p className="mt-2 break-all text-sm font-medium text-gray-900">
                {store.external_id}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Currency
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {store.currency}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Timezone
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {store.timezone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Status
              </p>
              <div className="mt-2">
                <StatusBadge status={store.status} />
              </div>
            </div>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Delete this store?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              This will permanently delete{' '}
              <span className="font-medium text-gray-700">
                {store.name}
              </span>{' '}
              and its associated records. This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {deleting ? 'Deleting...' : 'Delete store'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreDetails