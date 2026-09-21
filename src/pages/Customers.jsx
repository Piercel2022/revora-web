import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Search,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { createCustomer, getCustomers } from '../api/customers'
import { getStores } from '../api/stores'

const initialForm = {
  store_id: '',
  external_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  status: 'active',
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    icon: CheckCircle2,
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    icon: Clock3,
  },
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    className: 'bg-gray-50 text-gray-700 ring-gray-600/20',
    icon: Clock3,
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

function getCustomerName(customer) {
  const name = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()

  return name || 'Unnamed customer'
}

function getInitials(customer) {
  const name = getCustomerName(customer)

  if (name === 'Unnamed customer') {
    return '?'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function Customers() {
  const [customers, setCustomers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [storesLoading, setStoresLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState(initialForm)

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getCustomers()

      setCustomers(Array.isArray(data) ? data : [])
    } catch (requestError) {
      console.error('Failed to load customers:', requestError)

      setError(
        requestError.response?.data?.error ||
          'Unable to load customers.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const initializeCustomers = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getCustomers()

        if (!cancelled) {
          setCustomers(Array.isArray(data) ? data : [])
        }
      } catch (requestError) {
        console.error('Failed to load customers:', requestError)

        if (!cancelled) {
          setError(
            requestError.response?.data?.error ||
              'Unable to load customers.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    initializeCustomers()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    if (!normalizedSearch) {
      return customers
    }

    return customers.filter((customer) => {
      const searchableValues = [
        getCustomerName(customer),
        customer.email,
        customer.phone,
        customer.external_id,
        customer.store_id,
      ]

      return searchableValues.some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(normalizedSearch),
      )
    })
  }, [customers, search])

  const stats = useMemo(
    () => ({
      total: customers.length,
      active: customers.filter((customer) => customer.status === 'active')
        .length,
      inactive: customers.filter(
        (customer) => customer.status === 'inactive',
      ).length,
    }),
    [customers],
  )

  const handleOpenCreateModal = async () => {
    setForm(initialForm)
    setFormError('')
    setShowCreateModal(true)

    if (stores.length > 0) {
      return
    }

    setStoresLoading(true)

    try {
      const data = await getStores()
      setStores(Array.isArray(data) ? data : [])
    } catch (requestError) {
      console.error('Failed to load stores:', requestError)

      setFormError(
        requestError.response?.data?.error ||
          'Unable to load stores. Please try again.',
      )
    } finally {
      setStoresLoading(false)
    }
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

  const handleCreateCustomer = async (event) => {
    event.preventDefault()

    if (!form.store_id) {
      setFormError('Please select a store.')
      return
    }

    setCreating(true)
    setFormError('')

    try {
      const createdCustomer = await createCustomer(form)

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        createdCustomer,
      ])

      setShowCreateModal(false)
      setForm(initialForm)
    } catch (requestError) {
      console.error('Failed to create customer:', requestError)

      const validationErrors = requestError.response?.data?.errors

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFormError(validationErrors.join(', '))
      } else {
        setFormError(
          requestError.response?.data?.error ||
            'Unable to create the customer. Please try again.',
        )
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Customers
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Centralisez et pilotez les clients de vos différents stores.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Add customer
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total customers
            </span>
            <Users size={18} className="text-blue-500" />
          </div>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Active
            </span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stats.active}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Inactive
            </span>
            <Clock3 size={18} className="text-slate-400" />
          </div>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stats.inactive}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={loadCustomers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="m-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-medium">Unable to load customers</p>
              <p className="mt-1 text-red-600">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <RefreshCw size={18} className="animate-spin" />
              Loading customers...
            </div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              {search ? <Search size={21} /> : <UserPlus size={21} />}
            </div>

            <h2 className="mt-4 text-sm font-semibold text-slate-900">
              {search ? 'No customers found' : 'No customers yet'}
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {search
                ? 'Try another search term.'
                : 'Add your first customer to start building your customer base.'}
            </p>

            {!search && (
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={17} />
                Add customer
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Store
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                          {getInitials(customer)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 hover:text-blue-600">
                            {getCustomerName(customer)}
                          </p>

                          {customer.external_id && (
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {customer.external_id}
                            </p>
                          )}
                        </div>
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {customer.email || '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {customer.phone || '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex max-w-48 items-center truncate rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {customer.store_id || '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={customer.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredCustomers.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
            Showing {filteredCustomers.length} of {customers.length}{' '}
            customers
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add customer
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a customer to one of your connected stores.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreateModal}
                disabled={creating}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer}>
              <div className="space-y-5 px-6 py-6">
                {formError && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <p>{formError}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="customer-store"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Store <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="customer-store"
                    name="store_id"
                    value={form.store_id}
                    onChange={handleChange}
                    disabled={storesLoading || creating}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                  >
                    <option value="">
                      {storesLoading
                        ? 'Loading stores...'
                        : 'Select a store'}
                    </option>

                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                        {store.platform ? ` · ${store.platform}` : ''}
                      </option>
                    ))}
                  </select>

                  {!storesLoading && stores.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      No stores are available. Create a store first.
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="customer-first-name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      First name
                    </label>

                    <input
                      id="customer-first-name"
                      name="first_name"
                      type="text"
                      value={form.first_name}
                      onChange={handleChange}
                      disabled={creating}
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-last-name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Last name
                    </label>

                    <input
                      id="customer-last-name"
                      name="last_name"
                      type="text"
                      value={form.last_name}
                      onChange={handleChange}
                      disabled={creating}
                      autoComplete="family-name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="customer-email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>

                    <input
                      id="customer-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={creating}
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-phone"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Phone
                    </label>

                    <input
                      id="customer-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={creating}
                      autoComplete="tel"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="customer-external-id"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      External ID
                    </label>

                    <input
                      id="customer-external-id"
                      name="external_id"
                      type="text"
                      value={form.external_id}
                      onChange={handleChange}
                      disabled={creating}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                      placeholder="shopify-customer-123"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-status"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Status
                    </label>

                    <select
                      id="customer-status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      disabled={creating}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  disabled={creating}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating || storesLoading || stores.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating && (
                    <RefreshCw size={16} className="animate-spin" />
                  )}

                  {creating ? 'Creating...' : 'Create customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
