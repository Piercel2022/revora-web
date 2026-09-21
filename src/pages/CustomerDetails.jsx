import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Edit3,
  Mail,
  Phone,
  RefreshCw,
  Store,
  Trash2,
  User,
  UserRound,
  X,
} from 'lucide-react'
import {
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from '../api/customers'

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

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const initialEditForm = {
  external_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  status: 'active',
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.inactive
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

function getCustomerName(customer) {
  const name = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(' ')

  return name || customer.email || 'Unnamed customer'
}

function getInitials(customer) {
  const initials = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .map((value) => value.charAt(0).toUpperCase())
    .join('')

  return initials || 'CU'
}

function CustomerDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState(initialEditForm)
  const [updating, setUpdating] = useState(false)
  const [formError, setFormError] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadCustomer = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getCustomer(id)

        if (!cancelled) {
          setCustomer(data)
        }
      } catch (requestError) {
        console.error('Failed to load customer:', requestError)

        if (!cancelled) {
          setError(
            requestError.response?.data?.error ||
              'Unable to load customer.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCustomer()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleOpenEditModal = () => {
    setEditForm({
      external_id: customer.external_id || '',
      first_name: customer.first_name || '',
      last_name: customer.last_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      status: customer.status || 'active',
    })
    setFormError('')
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    if (updating) {
      return
    }

    setShowEditModal(false)
    setFormError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleUpdate = async (event) => {
    event.preventDefault()

    setFormError('')

    if (!editForm.first_name.trim() && !editForm.last_name.trim()) {
      setFormError('Please provide at least a first name or last name.')
      return
    }

    setUpdating(true)

    try {
      const updatedCustomer = await updateCustomer(id, {
        external_id: editForm.external_id.trim(),
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        status: editForm.status,
      })

      setCustomer(updatedCustomer)
      setShowEditModal(false)
    } catch (requestError) {
      console.error('Failed to update customer:', requestError)

      const validationErrors = requestError.response?.data?.errors

      if (Array.isArray(validationErrors)) {
        setFormError(validationErrors.join(', '))
      } else {
        setFormError(
          requestError.response?.data?.error ||
            'Unable to update customer.',
        )
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleOpenDeleteModal = () => {
    setDeleteError('')
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    if (deleting) {
      return
    }

    setShowDeleteModal(false)
    setDeleteError('')
  }

  const handleDelete = async () => {
    setDeleteError('')
    setDeleting(true)

    try {
      await deleteCustomer(id)
      navigate('/customers')
    } catch (requestError) {
      console.error('Failed to delete customer:', requestError)

      setDeleteError(
        requestError.response?.data?.error ||
          'Unable to delete customer.',
      )
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading customer...
          </div>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error || 'Customer not found.'}
          </p>
        </div>
      </div>
    )
  }

  const customerName = getCustomerName(customer)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenDeleteModal}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <button
            type="button"
            onClick={handleOpenEditModal}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Edit3 className="h-4 w-4" />
            Edit customer
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                {getInitials(customer)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                    {customerName}
                  </h1>
                  <StatusBadge status={customer.status} />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Customer profile
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-950">
                  Customer information
                </h2>
                <p className="text-xs text-slate-500">
                  Identity and account status
                </p>
              </div>
            </div>

            <dl className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-slate-500">First name</dt>
                <dd className="text-right text-sm font-medium text-slate-900">
                  {customer.first_name || '—'}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-slate-500">Last name</dt>
                <dd className="text-right text-sm font-medium text-slate-900">
                  {customer.last_name || '—'}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-slate-500">External ID</dt>
                <dd className="max-w-[60%] break-all text-right text-sm font-medium text-slate-900">
                  {customer.external_id || '—'}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-slate-500">Status</dt>
                <dd>
                  <StatusBadge status={customer.status} />
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-950">
                  Contact information
                </h2>
                <p className="text-xs text-slate-500">
                  Primary communication details
                </p>
              </div>
            </div>

            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">Email</dt>
                  <dd className="mt-1 break-all text-sm font-medium text-slate-900">
                    {customer.email || '—'}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-500">Phone</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">
                    {customer.phone || '—'}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Store className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-950">
                  Store relationship
                </h2>
                <p className="text-xs text-slate-500">
                  Store associated with this customer
                </p>
              </div>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Store ID</dt>
                <dd className="mt-1 break-all text-sm font-medium text-slate-900">
                  {customer.store_id || '—'}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">Customer ID</dt>
                <dd className="mt-1 break-all text-sm font-medium text-slate-900">
                  {customer.id || '—'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Edit customer
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update the customer profile information.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEditModal}
                disabled={updating}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close edit customer modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="space-y-5 px-6 py-6">
                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="edit-first-name"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      First name
                    </label>
                    <input
                      id="edit-first-name"
                      name="first_name"
                      type="text"
                      value={editForm.first_name}
                      onChange={handleChange}
                      disabled={updating}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-last-name"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Last name
                    </label>
                    <input
                      id="edit-last-name"
                      name="last_name"
                      type="text"
                      value={editForm.last_name}
                      onChange={handleChange}
                      disabled={updating}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-email"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={handleChange}
                      disabled={updating}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-phone"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Phone
                    </label>
                    <input
                      id="edit-phone"
                      name="phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={handleChange}
                      disabled={updating}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-external-id"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      External ID
                    </label>
                    <input
                      id="edit-external-id"
                      name="external_id"
                      type="text"
                      value={editForm.external_id}
                      onChange={handleChange}
                      disabled={updating}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-status"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Status
                    </label>
                    <select
                      id="edit-status"
                      name="status"
                      value={editForm.status}
                      onChange={handleChange}
                      disabled={updating}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
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

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={updating}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                  {updating ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-semibold text-slate-950">
                Delete customer?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You are about to permanently delete{' '}
                <span className="font-semibold text-slate-700">
                  {customerName}
                </span>
                . This action cannot be undone.
              </p>

              {deleteError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
                {deleting ? 'Deleting...' : 'Delete customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerDetails
