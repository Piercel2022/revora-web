import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Store as StoreIcon,
  X,
} from 'lucide-react'
import { createStore, getStores } from '../api/stores'

const initialForm = {
  name: '',
  platform: 'shopify',
  external_id: '',
  currency: 'EUR',
  timezone: 'Europe/Paris',
  status: 'active',
}

const platformOptions = [
  { value: 'shopify', label: 'Shopify' },
  { value: 'woocommerce', label: 'WooCommerce' },
  { value: 'prestashop', label: 'PrestaShop' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'disconnected', label: 'Disconnected' },
]

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
    className: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    icon: AlertCircle,
  },
}

const platformConfig = {
  shopify: {
    label: 'Shopify',
    className: 'bg-emerald-50 text-emerald-700',
  },
  woocommerce: {
    label: 'WooCommerce',
    className: 'bg-violet-50 text-violet-700',
  },
  prestashop: {
    label: 'PrestaShop',
    className: 'bg-blue-50 text-blue-700',
  },
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    className: 'bg-gray-100 text-gray-600 ring-gray-500/20',
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

function PlatformBadge({ platform }) {
  const config = platformConfig[platform] || {
    label: platform || 'Unknown',
    className: 'bg-gray-100 text-gray-600',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
          <Icon size={19} />
        </div>
      </div>
    </div>
  )
}

function Stores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState(initialForm)

  const fetchStores = useCallback(async () => {
    const data = await getStores()

    return Array.isArray(data) ? data : []
  }, [])

  const loadStores = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchStores()
      setStores(data)
    } catch (requestError) {
      console.error('Failed to load stores:', requestError)

      setError(
        requestError.response?.data?.error ||
          'Unable to load your stores. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [fetchStores])

  useEffect(() => {
    let cancelled = false

    const initializeStores = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await fetchStores()

        if (!cancelled) {
          setStores(data)
        }
      } catch (requestError) {
        console.error('Failed to load stores:', requestError)

        if (!cancelled) {
          setError(
            requestError.response?.data?.error ||
              'Unable to load your stores. Please try again.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    initializeStores()

    return () => {
      cancelled = true
    }
  }, [fetchStores])

  const filteredStores = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return stores
    }

    return stores.filter((store) => {
      return [
        store.name,
        store.platform,
        store.external_id,
        store.currency,
        store.timezone,
        store.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [search, stores])

  const stats = useMemo(() => {
    return {
      total: stores.length,
      active: stores.filter((store) => store.status === 'active').length,
      paused: stores.filter((store) => store.status === 'paused').length,
      disconnected: stores.filter(
        (store) => store.status === 'disconnected',
      ).length,
    }
  }, [stores])

  const handleOpenCreateModal = () => {
    setForm(initialForm)
    setFormError('')
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    if (creating) {
      return
    }

    setShowCreateModal(false)
    setFormError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleCreateStore = async (event) => {
    event.preventDefault()

    setCreating(true)
    setFormError('')

    try {
      const createdStore = await createStore(form)

      setStores((currentStores) => [...currentStores, createdStore])
      setShowCreateModal(false)
      setForm(initialForm)
    } catch (requestError) {
      console.error('Failed to create store:', requestError)

      const validationErrors = requestError.response?.data?.errors

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFormError(validationErrors.join(', '))
      } else {
        setFormError(
          requestError.response?.data?.error ||
            'Unable to create the store. Please try again.',
        )
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <span className="text-gray-600">Stores</span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            Stores
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your connected ecommerce stores and their status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={17} />
          Add store
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={stats.total} icon={Building2} />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} />
        <StatCard label="Paused" value={stats.paused} icon={Clock3} />
        <StatCard
          label="Disconnected"
          value={stats.disconnected}
          icon={AlertCircle}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Your stores</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredStores.length} store
              {filteredStores.length === 1 ? '' : 's'} displayed
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stores..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-900/5 sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={loadStores}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="m-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Unable to load stores</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2 size={18} className="animate-spin" />
              Loading stores...
            </div>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <StoreIcon size={22} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              {search ? 'No stores found' : 'No stores yet'}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {search
                ? 'Try adjusting your search to find another store.'
                : 'Connect your first ecommerce store to start managing your data in Revora.'}
            </p>

            {!search && (
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <Plus size={17} />
                Add your first store
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3.5">Store</th>
                  <th className="px-5 py-3.5">Platform</th>
                  <th className="px-5 py-3.5">Currency</th>
                  <th className="px-5 py-3.5">Timezone</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredStores.map((store) => (
                  <tr
                    key={store.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div>
                        <Link
                          to={`/stores/${store.id}`}
                          className="font-medium text-gray-900 transition hover:text-gray-600"
                        >
                          {store.name}
                        </Link>

                        <p className="mt-1 text-xs text-gray-400">
                          {store.external_id}
                        </p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <PlatformBadge platform={store.platform} />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {store.currency}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {store.timezone}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <StatusBadge status={store.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add store
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add an ecommerce store to your Revora workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreateModal}
                disabled={creating}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStore}>
              <div className="space-y-5 px-6 py-6">
                {formError && (
                  <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Unable to create store</p>
                      <p className="mt-1">{formError}</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="store-name"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Store name
                    </label>

                    <input
                      id="store-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="My Shopify Store"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="store-platform"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Platform
                    </label>

                    <select
                      id="store-platform"
                      name="platform"
                      value={form.platform}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5"
                    >
                      {platformOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="store-status"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>

                    <select
                      id="store-status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="store-external-id"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      External ID
                    </label>

                    <input
                      id="store-external-id"
                      name="external_id"
                      type="text"
                      value={form.external_id}
                      onChange={handleChange}
                      placeholder="shopify-store-001"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="store-currency"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Currency
                    </label>

                    <input
                      id="store-currency"
                      name="currency"
                      type="text"
                      value={form.currency}
                      onChange={handleChange}
                      placeholder="EUR"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="store-timezone"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Timezone
                    </label>

                    <input
                      id="store-timezone"
                      name="timezone"
                      type="text"
                      value={form.timezone}
                      onChange={handleChange}
                      placeholder="Europe/Paris"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  disabled={creating}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {creating ? 'Creating...' : 'Create store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stores