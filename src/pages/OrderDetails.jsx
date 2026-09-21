import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  FileText,
  Hash,
  Loader2,
  Pencil,
  Plus,
  ShoppingBag,
  Store as StoreIcon,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createOrderItem,
  deleteOrder,
  deleteOrderItem,
  getOrder,
  getOrderItems,
  updateOrder,
  updateOrderItem,
} from '../api/orders'
import { getStores } from '../api/stores'
import { getCustomers } from '../api/customers'
import { getProducts } from '../api/products'

const ORDER_STATUSES = [
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
  cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
  refunded: 'bg-violet-50 text-violet-700 ring-violet-600/20',
}

const emptyOrderForm = {
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

const emptyItemForm = {
  product_id: '',
  external_id: '',
  title: '',
  sku: '',
  quantity: '1',
  unit_price: '',
  discount: '0',
  tax: '0',
  total: '',
  currency: 'EUR',
}

function formatCurrency(value, currency = 'EUR') {
  const amount = Number(value || 0)

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

function formatDate(value) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatDateInput(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)

  return localDate.toISOString().slice(0, 16)
}

function getStatusLabel(status) {
  return (
    ORDER_STATUSES.find((item) => item.value === status)?.label ||
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

function getProductName(product) {
  return product?.title || product?.name || 'Produit inconnu'
}

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function calculateItemTotal(form) {
  const quantity = toNumber(form.quantity)
  const unitPrice = toNumber(form.unit_price)
  const discount = toNumber(form.discount)
  const tax = toNumber(form.tax)

  return Math.max(
    0,
    quantity * unitPrice - discount + tax,
  )
}

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [stores, setStores] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSavingItem, setIsSavingItem] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState(null)

  const [form, setForm] = useState(emptyOrderForm)
  const [itemForm, setItemForm] = useState(emptyItemForm)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          orderData,
          orderItemsData,
          storesData,
          customersData,
          productsData,
        ] = await Promise.all([
          getOrder(id),
          getOrderItems(id),
          getStores(),
          getCustomers(),
          getProducts(),
        ])

        if (cancelled) return

        setOrder(orderData)
        setItems(orderItemsData)
        setStores(storesData)
        setCustomers(customersData)
        setProducts(productsData)
      } catch (requestError) {
        if (cancelled) return

        setError(
          requestError.response?.data?.error ||
            requestError.response?.data?.message ||
            'Impossible de charger la commande.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [id])

  const store = stores.find((item) => item.id === order?.store_id)

  const customer = customers.find(
    (item) => item.id === order?.customer_id,
  )

  const storeCustomers = customers.filter(
    (item) => item.store_id === order?.store_id,
  )

  const storeProducts = useMemo(
    () =>
      products.filter(
        (item) => item.store_id === order?.store_id,
      ),
    [products, order?.store_id],
  )

  const totalItems = items.reduce(
    (sum, item) => sum + toNumber(item.quantity),
    0,
  )

  const handleOpenEdit = () => {
    if (!order) return

    setForm({
      customer_id: order.customer_id || '',
      external_id: order.external_id || '',
      order_number: order.order_number || '',
      status: order.status || 'pending',
      currency: order.currency || 'EUR',
      subtotal: order.subtotal ?? '',
      tax: order.tax ?? '',
      shipping: order.shipping ?? '',
      discount: order.discount ?? '',
      total: order.total ?? '',
      ordered_at: formatDateInput(order.ordered_at),
    })

    setIsEditOpen(true)
    setError('')
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

    if (!form.external_id.trim()) {
      setError("L'identifiant externe est obligatoire.")
      return
    }

    if (!form.order_number.trim()) {
      setError('Le numéro de commande est obligatoire.')
      return
    }

    const numericFields = [
      'subtotal',
      'tax',
      'shipping',
      'discount',
      'total',
    ]

    for (const field of numericFields) {
      if (toNumber(form[field]) < 0) {
        setError('Les montants doivent être positifs ou nuls.')
        return
      }
    }

    setIsSaving(true)
    setError('')

    try {
      const updatedOrder = await updateOrder(id, {
        customer_id: form.customer_id || null,
        external_id: form.external_id.trim(),
        order_number: form.order_number.trim(),
        status: form.status,
        currency: form.currency.trim().toUpperCase(),
        subtotal: toNumber(form.subtotal),
        tax: toNumber(form.tax),
        shipping: toNumber(form.shipping),
        discount: toNumber(form.discount),
        total: toNumber(form.total),
        ordered_at: form.ordered_at
          ? new Date(form.ordered_at).toISOString()
          : null,
      })

      setOrder(updatedOrder)
      setIsEditOpen(false)
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          'Impossible de modifier la commande.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')

    try {
      await deleteOrder(id)
      navigate('/orders')
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          'Impossible de supprimer la commande.',
      )
      setIsDeleting(false)
      setIsDeleteOpen(false)
    }
  }

  const handleOpenCreateItem = () => {
    setEditingItem(null)
    setItemForm({
      ...emptyItemForm,
      currency: order?.currency || 'EUR',
    })
    setError('')
    setIsItemModalOpen(true)
  }

  const handleOpenEditItem = (item) => {
    setEditingItem(item)

    setItemForm({
      product_id: item.product_id || '',
      external_id: item.external_id || '',
      title: item.title || '',
      sku: item.sku || '',
      quantity: String(item.quantity ?? 1),
      unit_price: item.unit_price ?? '',
      discount: item.discount ?? '0',
      tax: item.tax ?? '0',
      total: item.total ?? '',
      currency: item.currency || order?.currency || 'EUR',
    })

    setError('')
    setIsItemModalOpen(true)
  }

  const handleItemChange = (event) => {
    const { name, value } = event.target

    setItemForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleProductChange = (event) => {
    const productId = event.target.value

    if (!productId) {
      setItemForm((current) => ({
        ...current,
        product_id: '',
      }))
      return
    }

    const product = storeProducts.find(
      (item) => item.id === productId,
    )

    if (!product) return

    setItemForm((current) => {
      const nextForm = {
        ...current,
        product_id: product.id,
        title: product.title || product.name || '',
        sku: product.sku || '',
        unit_price: product.price ?? '',
        currency: product.currency || order?.currency || 'EUR',
      }

      return {
        ...nextForm,
        total: calculateItemTotal(nextForm).toFixed(2),
      }
    })
  }

  const handleSaveItem = async (event) => {
    event.preventDefault()

    if (!itemForm.product_id) {
      setError('Le produit est obligatoire.')
      return
    }

    if (!itemForm.title.trim()) {
      setError("Le titre de l'article est obligatoire.")
      return
    }

    const quantity = Number(itemForm.quantity)

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError('La quantité doit être un entier supérieur à zéro.')
      return
    }

    const numericFields = [
      'unit_price',
      'discount',
      'tax',
      'total',
    ]

    for (const field of numericFields) {
      if (toNumber(itemForm[field]) < 0) {
        setError('Les montants doivent être positifs ou nuls.')
        return
      }
    }

    setIsSavingItem(true)
    setError('')

    try {
      const payload = {
        product_id: itemForm.product_id,
        external_id: itemForm.external_id.trim() || null,
        title: itemForm.title.trim(),
        sku: itemForm.sku.trim(),
        quantity,
        unit_price: toNumber(itemForm.unit_price),
        discount: toNumber(itemForm.discount),
        tax: toNumber(itemForm.tax),
        total: toNumber(itemForm.total),
        currency: itemForm.currency.trim().toUpperCase(),
      }

      const savedItem = editingItem
        ? await updateOrderItem(id, editingItem.id, payload)
        : await createOrderItem(id, payload)

      setItems((current) => {
        if (!editingItem) {
          return [...current, savedItem]
        }

        return current.map((item) =>
          item.id === savedItem.id ? savedItem : item,
        )
      })

      setIsItemModalOpen(false)
      setEditingItem(null)
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          "Impossible d'enregistrer l'article.",
      )
    } finally {
      setIsSavingItem(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    const confirmed = window.confirm(
      'Supprimer cet article de la commande ?',
    )

    if (!confirmed) return

    setDeletingItemId(itemId)
    setError('')

    try {
      await deleteOrderItem(id, itemId)

      setItems((current) =>
        current.filter((item) => item.id !== itemId),
      )
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          "Impossible de supprimer l'article.",
      )
    } finally {
      setDeletingItemId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-5xl">
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux commandes
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || 'Commande introuvable.'}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/orders"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux commandes
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Modifier
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                <ShoppingBag className="h-4 w-4" />
                Commande
              </span>

              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                  STATUS_STYLES[order.status] ||
                  'bg-slate-100 text-slate-700 ring-slate-600/20'
                }`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {order.order_number}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              ID externe : {order.external_id}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-5 py-4 text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {formatCurrency(order.total, order.currency)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <StoreIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Boutique
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                {store?.name || 'Boutique inconnue'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Client
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                {getCustomerName(customer)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Commandée le
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatDate(order.ordered_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Devise
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {order.currency}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-950">
                Articles de la commande
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {totalItems} article{totalItems > 1 ? 's' : ''}
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateItem}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                Aucun article
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ajoutez le premier article à cette commande.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Qté
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Prix unitaire
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const product = products.find(
                      (productItem) => productItem.id === item.product_id,
                    )

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {item.title || getProductName(product)}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {item.sku || product?.sku || '—'}
                        </td>

                        <td className="px-6 py-4 text-right text-sm text-slate-700">
                          {item.quantity}
                        </td>

                        <td className="px-6 py-4 text-right text-sm text-slate-700">
                          {formatCurrency(
                            item.unit_price,
                            item.currency,
                          )}
                        </td>

                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                          {formatCurrency(item.total, item.currency)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditItem(item)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              title="Modifier"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              disabled={deletingItemId === item.id}
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Supprimer"
                            >
                              {deletingItemId === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
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
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Résumé financier
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Sous-total</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(order.subtotal, order.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Taxes</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(order.tax, order.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Livraison</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(order.shipping, order.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Remise</span>
                <span className="font-medium text-slate-900">
                  -{formatCurrency(order.discount, order.currency)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-950">
                    Total
                  </span>
                  <span className="text-lg font-bold text-slate-950">
                    {formatCurrency(order.total, order.currency)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">
              Informations
            </h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-500">
                    ID commande
                  </dt>
                  <dd className="mt-1 break-all font-medium text-slate-800">
                    {order.id}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-500">
                    ID externe
                  </dt>
                  <dd className="mt-1 break-all font-medium text-slate-800">
                    {order.external_id}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs text-slate-500">Statut</dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {getStatusLabel(order.status)}
                  </dd>
                </div>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Modifier la commande
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Les informations de la boutique ne sont pas
                  modifiables.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Boutique
                  </span>
                  <input
                    value={store?.name || ''}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Client
                  </span>
                  <select
                    name="customer_id"
                    value={form.customer_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option value="">Aucun client</option>
                    {storeCustomers.map((item) => (
                      <option key={item.id} value={item.id}>
                        {getCustomerName(item)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Numéro de commande
                  </span>
                  <input
                    name="order_number"
                    value={form.order_number}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Identifiant externe
                  </span>
                  <input
                    name="external_id"
                    value={form.external_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Statut
                  </span>
                  <div className="relative">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none focus:border-slate-400"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Devise
                  </span>
                  <input
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    maxLength={3}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                {[
                  ['subtotal', 'Sous-total'],
                  ['tax', 'Taxes'],
                  ['shipping', 'Livraison'],
                  ['discount', 'Remise'],
                  ['total', 'Total'],
                ].map(([name, label]) => (
                  <label key={name} className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      {label}
                    </span>
                    <input
                      type="number"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                ))}

                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Date de commande
                  </span>
                  <input
                    type="datetime-local"
                    name="ordered_at"
                    value={form.ordered_at}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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

      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {editingItem
                    ? "Modifier l'article"
                    : 'Ajouter un article'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Le produit doit appartenir à la boutique de cette
                  commande.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Produit
                  </span>

                  <div className="relative">
                    <select
                      name="product_id"
                      value={itemForm.product_id}
                      onChange={handleProductChange}
                      required
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none focus:border-slate-400"
                    >
                      <option value="">
                        Sélectionner un produit
                      </option>

                      {storeProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {getProductName(product)}
                          {product.sku ? ` — ${product.sku}` : ''}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  {storeProducts.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      Aucun produit n'est disponible pour cette
                      boutique.
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Titre
                  </span>
                  <input
                    name="title"
                    value={itemForm.title}
                    onChange={handleItemChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    SKU
                  </span>
                  <input
                    name="sku"
                    value={itemForm.sku}
                    onChange={handleItemChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Quantité
                  </span>
                  <input
                    type="number"
                    name="quantity"
                    value={itemForm.quantity}
                    onChange={handleItemChange}
                    min="1"
                    step="1"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Prix unitaire
                  </span>
                  <input
                    type="number"
                    name="unit_price"
                    value={itemForm.unit_price}
                    onChange={handleItemChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Remise
                  </span>
                  <input
                    type="number"
                    name="discount"
                    value={itemForm.discount}
                    onChange={handleItemChange}
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Taxe
                  </span>
                  <input
                    type="number"
                    name="tax"
                    value={itemForm.tax}
                    onChange={handleItemChange}
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Total
                  </span>
                  <input
                    type="number"
                    name="total"
                    value={itemForm.total}
                    onChange={handleItemChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Devise
                  </span>
                  <input
                    name="currency"
                    value={itemForm.currency}
                    onChange={handleItemChange}
                    maxLength={3}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Identifiant externe
                  </span>
                  <input
                    name="external_id"
                    value={itemForm.external_id}
                    onChange={handleItemChange}
                    placeholder="Optionnel"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSavingItem || storeProducts.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingItem && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {editingItem ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              Supprimer cette commande ?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              La commande <strong>{order.order_number}</strong> sera
              supprimée définitivement ainsi que ses lignes de
              commande.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
