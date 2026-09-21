import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  Plus,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react'
import { createOrder, getOrders } from '../api/orders'
import { getStores } from '../api/stores'
import { getCustomers } from '../api/customers'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payée' },
  { value: 'fulfilled', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
  { value: 'refunded', label: 'Remboursée' },
]

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  paid: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  fulfilled: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  refunded: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

const EMPTY_FORM = {
  store_id: '',
  customer_id: '',
  external_id: '',
  order_number: '',
  status: 'pending',
  currency: 'EUR',
  subtotal: '',
  tax: '',
  shipping: '',
  discount: '',
  total: '',
  ordered_at: '',
}

function getStatusLabel(status) {
  return (
    STATUS_OPTIONS.find((option) => option.value === status)?.label ||
    status ||
    '—'
  )
}

function formatCurrency(value, currency = 'EUR') {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(Number(value))
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

function getCustomerName(customer) {
  if (!customer) {
    return ''
  }

  return [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(' ') || customer.company_name || customer.email || customer.id
}

function getErrorMessage(error, fallback) {
  const data = error?.response?.data

  if (data?.errors) {
    if (Array.isArray(data.errors)) {
      return data.errors.join(', ')
    }

    if (typeof data.errors === 'object') {
      return Object.entries(data.errors)
        .map(([field, messages]) => {
          const value = Array.isArray(messages) ? messages.join(', ') : messages
          return `${field}: ${value}`
        })
        .join(' | ')
    }

    if (typeof data.errors === 'string') {
      return data.errors
    }
  }

  return data?.message || error?.message || fallback
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [stores, setStores] = useState([])
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)

    useEffect(() => {
    let cancelled = false

    const loadOrdersData = async () => {
      setLoading(true)
      setError('')

      try {
        const [ordersData, storesData, customersData] = await Promise.all([
          getOrders(),
          getStores(),
          getCustomers(),
        ])

        if (cancelled) {
          return
        }

        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setStores(Array.isArray(storesData) ? storesData : [])
        setCustomers(Array.isArray(customersData) ? customersData : [])
      } catch (requestError) {
        if (cancelled) {
          return
        }

        setError(
          getErrorMessage(
            requestError,
            'Impossible de charger les commandes.',
          ),
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOrdersData()

    return () => {
      cancelled = true
    }
  }, [])

  const storesById = useMemo(
    () => new Map(stores.map((store) => [store.id, store])),
    [stores],
  )

  const customersById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers],
  )

  const filteredCustomers = useMemo(() => {
    if (!form.store_id) {
      return []
    }

    return customers.filter(
      (customer) => customer.store_id === form.store_id,
    )
  }, [customers, form.store_id])

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return orders
    }

    return orders.filter((order) => {
      const customer = customersById.get(order.customer_id)
      const store = storesById.get(order.store_id)
      const customerName = getCustomerName(customer)

      return [
        order.order_number,
        order.external_id,
        order.status,
        customerName,
        store?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [orders, search, customersById, storesById])

  const totalRevenue = useMemo(
    () =>
      orders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0,
      ),
    [orders],
  )

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === 'pending').length,
    [orders],
  )

  const paidCount = useMemo(
    () => orders.filter((order) => order.status === 'paid').length,
    [orders],
  )

  const fulfilledCount = useMemo(
    () => orders.filter((order) => order.status === 'fulfilled').length,
    [orders],
  )

  const handleOpenCreate = () => {
    setForm(EMPTY_FORM)
    setSubmitError('')
    setIsCreateOpen(true)
  }

  const handleCloseCreate = () => {
    if (isSubmitting) {
      return
    }

    setIsCreateOpen(false)
    setSubmitError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'store_id') {
      setForm((current) => ({
        ...current,
        store_id: value,
        customer_id: '',
      }))
      return
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!form.store_id) {
      setSubmitError('Le store est obligatoire.')
      return
    }

    if (!form.external_id.trim()) {
      setSubmitError("L'identifiant externe est obligatoire.")
      return
    }

    if (!form.order_number.trim()) {
      setSubmitError('Le numéro de commande est obligatoire.')
      return
    }

    if (form.customer_id) {
      const customer = customersById.get(form.customer_id)

      if (!customer || customer.store_id !== form.store_id) {
        setSubmitError('Le client sélectionné doit appartenir au store.')
        return
      }
    }

    const numericFields = [
      'subtotal',
      'tax',
      'shipping',
      'discount',
      'total',
    ]

    for (const field of numericFields) {
      if (form[field] !== '' && Number(form[field]) < 0) {
        setSubmitError('Les montants ne peuvent pas être négatifs.')
        return
      }
    }

    setIsSubmitting(true)

    try {
      const payload = {
        store_id: form.store_id,
        customer_id: form.customer_id || null,
        external_id: form.external_id.trim(),
        order_number: form.order_number.trim(),
        status: form.status,
        currency: form.currency.trim().toUpperCase(),
        subtotal: Number(form.subtotal || 0),
        tax: Number(form.tax || 0),
        shipping: Number(form.shipping || 0),
        discount: Number(form.discount || 0),
        total: Number(form.total || 0),
        ordered_at: form.ordered_at
          ? new Date(form.ordered_at).toISOString()
          : null,
      }

      const createdOrder = await createOrder(payload)

      setOrders((current) => [createdOrder, ...current])
      setIsCreateOpen(false)
      setForm(EMPTY_FORM)
    } catch (requestError) {
      setSubmitError(
        getErrorMessage(
          requestError,
          'Impossible de créer la commande.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <ShoppingCart size={21} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Commerce
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Orders
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Suivez les commandes provenant de vos stores, leurs statuts
            et leur chiffre d&apos;affaires.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Nouvelle commande
        </button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Commandes</p>
            <ShoppingCart size={18} className="text-slate-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {orders.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">Total enregistré</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Chiffre d&apos;affaires
            </p>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Total des commandes</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              En attente
            </p>
            <Clock3 size={18} className="text-amber-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {pendingCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {paidCount} payée{paidCount > 1 ? 's' : ''}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Terminées
            </p>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {fulfilledCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Commandes fulfilled
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une commande..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={17} className="animate-spin" />
              Chargement des commandes...
            </div>
          </div>
        ) : error ? (
          <div className="m-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Impossible de charger les commandes</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <ShoppingCart size={30} className="text-slate-300" />
            <h2 className="mt-4 text-sm font-semibold text-slate-900">
              {search ? 'Aucune commande trouvée' : 'Aucune commande'}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {search
                ? 'Essayez avec un autre terme de recherche.'
                : 'Créez votre première commande pour commencer.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Commande
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Store
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Statut
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const store = storesById.get(order.store_id)
                  const customer = customersById.get(order.customer_id)

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/orders/${order.id}`}
                          className="font-semibold text-slate-900 hover:text-emerald-600"
                        >
                          {order.order_number}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">
                          {order.external_id}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {store?.name || '—'}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {getCustomerName(customer) || '—'}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(order.ordered_at)}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {formatCurrency(order.total, order.currency)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                            STATUS_STYLES[order.status] ||
                            'bg-slate-100 text-slate-600 ring-slate-500/20'
                          }`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Eye size={14} />
                          Voir
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Nouvelle commande
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ajoutez une commande à l&apos;un de vos stores.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreate}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {submitError && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Store *
                  </span>
                  <select
                    name="store_id"
                    value={form.store_id}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option value="">Sélectionner un store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Client
                  </span>
                  <select
                    name="customer_id"
                    value={form.customer_id}
                    onChange={handleChange}
                    disabled={!form.store_id}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {form.store_id
                        ? 'Aucun client'
                        : 'Sélectionnez d’abord un store'}
                    </option>
                    {filteredCustomers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {getCustomerName(customer)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Numéro de commande *
                  </span>
                  <input
                    name="order_number"
                    value={form.order_number}
                    onChange={handleChange}
                    required
                    placeholder="REV-1004"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Identifiant externe *
                  </span>
                  <input
                    name="external_id"
                    value={form.external_id}
                    onChange={handleChange}
                    required
                    placeholder="woocommerce-order-1004"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Statut
                  </span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Devise
                  </span>
                  <input
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    maxLength={3}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Sous-total
                  </span>
                  <input
                    name="subtotal"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.subtotal}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Taxe
                  </span>
                  <input
                    name="tax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.tax}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Livraison
                  </span>
                  <input
                    name="shipping"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.shipping}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Remise
                  </span>
                  <input
                    name="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Total
                  </span>
                  <input
                    name="total"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.total}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarDays size={15} />
                    Date de commande
                  </span>
                  <input
                    name="ordered_at"
                    type="datetime-local"
                    value={form.ordered_at}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={handleCloseCreate}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  Créer la commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
