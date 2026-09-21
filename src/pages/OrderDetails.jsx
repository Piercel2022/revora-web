import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit3,
  Loader2,
  Package,
  Plus,
  ShoppingCart,
  Store as StoreIcon,
  Trash2,
  User,
  X,
} from 'lucide-react'
import {
  createOrderItem,
  deleteOrder,
  deleteOrderItem,
  getOrder,
  getOrderItems,
  updateOrder,
  updateOrderItem,
} from '../api/orders'
import { getCustomers } from '../api/customers'
import { getProducts } from '../api/products'
import { getStores } from '../api/stores'

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

const EMPTY_ORDER_FORM = {
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

const EMPTY_ITEM_FORM = {
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
    timeStyle: 'short',
  }).format(new Date(value))
}

function getCustomerName(customer) {
  if (!customer) {
    return '—'
  }

  return (
    [customer.first_name, customer.last_name]
      .filter(Boolean)
      .join(' ') ||
    customer.company_name ||
    customer.email ||
    customer.id
  )
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

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isOrderEditOpen, setIsOrderEditOpen] = useState(false)
  const [isItemOpen, setIsItemOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [orderForm, setOrderForm] = useState(EMPTY_ORDER_FORM)
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM)

  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [
          orderData,
          orderItemsData,
          customersData,
          productsData,
          storesData,
        ] = await Promise.all([
          getOrder(id),
          getOrderItems(id),
          getCustomers(),
          getProducts(),
          getStores(),
        ])

        if (cancelled) {
          return
        }

        setOrder(orderData)
        setItems(Array.isArray(orderItemsData) ? orderItemsData : [])
        setCustomers(Array.isArray(customersData) ? customersData : [])
        setProducts(Array.isArray(productsData) ? productsData : [])
        setStores(Array.isArray(storesData) ? storesData : [])
      } catch (requestError) {
        if (cancelled) {
          return
        }

        setError(
          getErrorMessage(
            requestError,
            'Impossible de charger la commande.',
          ),
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [id])

  const customer = useMemo(
    () => customers.find((item) => item.id === order?.customer_id),
    [customers, order],
  )

  const store = useMemo(
    () => stores.find((item) => item.id === order?.store_id),
    [stores, order],
  )

  const storeProducts = useMemo(
    () => products.filter((product) => product.store_id === order?.store_id),
    [products, order],
  )

  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  )

  const totalItems = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
      ),
    [items],
  )

  const handleOpenOrderEdit = () => {
    if (!order) {
      return
    }

    setSubmitError('')
    setOrderForm({
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
      ordered_at: order.ordered_at
        ? new Date(order.ordered_at).toISOString().slice(0, 16)
        : '',
    })
    setIsOrderEditOpen(true)
  }

  const handleOrderChange = (event) => {
    const { name, value } = event.target

    setOrderForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleOrderSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!orderForm.external_id.trim()) {
      setSubmitError("L'identifiant externe est obligatoire.")
      return
    }

    if (!orderForm.order_number.trim()) {
      setSubmitError('Le numéro de commande est obligatoire.')
      return
    }

    setIsSubmitting(true)

    try {
      const updatedOrder = await updateOrder(id, {
        customer_id: orderForm.customer_id || null,
        external_id: orderForm.external_id.trim(),
        order_number: orderForm.order_number.trim(),
        status: orderForm.status,
        currency: orderForm.currency.trim().toUpperCase(),
        subtotal: Number(orderForm.subtotal || 0),
        tax: Number(orderForm.tax || 0),
        shipping: Number(orderForm.shipping || 0),
        discount: Number(orderForm.discount || 0),
        total: Number(orderForm.total || 0),
        ordered_at: orderForm.ordered_at
          ? new Date(orderForm.ordered_at).toISOString()
          : null,
      })

      setOrder(updatedOrder)
      setIsOrderEditOpen(false)
    } catch (requestError) {
      setSubmitError(
        getErrorMessage(
          requestError,
          'Impossible de modifier la commande.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenCreateItem = () => {
    setEditingItem(null)
    setSubmitError('')
    setItemForm({
      ...EMPTY_ITEM_FORM,
      currency: order?.currency || 'EUR',
    })
    setIsItemOpen(true)
  }

  const handleOpenEditItem = (item) => {
    setEditingItem(item)
    setSubmitError('')
    setItemForm({
      product_id: item.product_id || '',
      external_id: item.external_id || '',
      title: item.title || '',
      sku: item.sku || '',
      quantity: String(item.quantity ?? 1),
      unit_price: item.unit_price ?? '',
      discount: item.discount ?? 0,
      tax: item.tax ?? 0,
      total: item.total ?? '',
      currency: item.currency || order?.currency || 'EUR',
    })
    setIsItemOpen(true)
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
    const product = productsById.get(productId)

    setItemForm((current) => ({
      ...current,
      product_id: productId,
      title: product?.title || current.title,
      sku: product?.sku || current.sku,
      unit_price:
        product?.price !== undefined && product?.price !== null
          ? product.price
          : current.unit_price,
      currency: product?.currency || order?.currency || current.currency,
    }))
  }

  const handleItemSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!itemForm.product_id) {
      setSubmitError('Le produit est obligatoire.')
      return
    }

    if (!itemForm.title.trim()) {
      setSubmitError('Le titre est obligatoire.')
      return
    }

    if (Number(itemForm.quantity) <= 0) {
      setSubmitError('La quantité doit être supérieure à 0.')
      return
    }

    const numericFields = [
      'unit_price',
      'discount',
      'tax',
      'total',
    ]

    for (const field of numericFields) {
      if (itemForm[field] !== '' && Number(itemForm[field]) < 0) {
        setSubmitError('Les montants ne peuvent pas être négatifs.')
        return
      }
    }

    setIsSubmitting(true)

    try {
      const payload = {
        product_id: itemForm.product_id,
        external_id: itemForm.external_id.trim() || null,
        title: itemForm.title.trim(),
        sku: itemForm.sku.trim() || null,
        quantity: Number(itemForm.quantity),
        unit_price: Number(itemForm.unit_price || 0),
        discount: Number(itemForm.discount || 0),
        tax: Number(itemForm.tax || 0),
        total: Number(itemForm.total || 0),
        currency: itemForm.currency.trim().toUpperCase(),
      }

      if (editingItem) {
        const updatedItem = await updateOrderItem(
          id,
          editingItem.id,
          payload,
        )

        setItems((current) =>
          current.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        )
      } else {
        const createdItem = await createOrderItem(id, payload)
        setItems((current) => [...current, createdItem])
      }

      setIsItemOpen(false)
      setEditingItem(null)
      setItemForm(EMPTY_ITEM_FORM)
    } catch (requestError) {
      setSubmitError(
        getErrorMessage(
          requestError,
          editingItem
            ? 'Impossible de modifier la ligne.'
            : 'Impossible de créer la ligne.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteItem = async () => {
    if (!deleteTarget) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await deleteOrderItem(id, deleteTarget.id)

      setItems((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      )
      setDeleteTarget(null)
    } catch (requestError) {
      setSubmitError(
        getErrorMessage(
          requestError,
          'Impossible de supprimer la ligne.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteOrder = async () => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await deleteOrder(id)
      navigate('/orders')
    } catch (requestError) {
      setSubmitError(
        getErrorMessage(
          requestError,
          'Impossible de supprimer la commande.',
        ),
      )
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={18} className="animate-spin" />
          Chargement de la commande...
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Retour aux commandes
        </Link>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Commande introuvable</p>
            <p className="mt-1">
              {error || 'Cette commande n’existe pas ou n’est plus accessible.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Retour aux commandes
          </Link>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <ShoppingCart size={21} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Commande
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {order.order_number}
              </h1>
            </div>

            <span
              className={`ml-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                STATUS_STYLES[order.status] ||
                'bg-slate-100 text-slate-600 ring-slate-500/20'
              }`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {order.external_id}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleOpenOrderEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Edit3 size={16} />
            Modifier
          </button>

          <button
            type="button"
            onClick={() =>
              setDeleteTarget({
                type: 'order',
                id: order.id,
                label: order.order_number,
              })
            }
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>

      {submitError && !isItemOpen && !isOrderEditOpen && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{submitError}</p>
        </div>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(order.total, order.currency)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {order.currency}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Sous-total
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(order.subtotal, order.currency)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Avant taxes et livraison
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Lignes
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {items.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {totalItems} article{totalItems > 1 ? 's' : ''}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Commandée le
          </p>
          <p className="mt-2 text-base font-bold text-slate-900">
            {formatDate(order.ordered_at)}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <StoreIcon size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Store
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {store?.name || '—'}
              </p>
            </div>
          </div>

          {store && (
            <div className="mt-5 space-y-2 text-sm text-slate-500">
              <p>
                Plateforme :{' '}
                <span className="font-medium text-slate-700">
                  {store.platform || '—'}
                </span>
              </p>
              <p>
                Domaine :{' '}
                <span className="font-medium text-slate-700">
                  {store.domain || '—'}
                </span>
              </p>
              <p>
                Devise :{' '}
                <span className="font-medium text-slate-700">
                  {store.currency || order.currency}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Client
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {getCustomerName(customer)}
              </p>
            </div>
          </div>

          {customer && (
            <div className="mt-5 space-y-2 text-sm text-slate-500">
              <p>{customer.email || 'Email non renseigné'}</p>
              <p>{customer.phone || 'Téléphone non renseigné'}</p>
              {customer.company_name && (
                <p className="font-medium text-slate-700">
                  {customer.company_name}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Informations
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                Commande #{order.order_number}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm text-slate-500">
            <p>
              Créée le :{' '}
              <span className="font-medium text-slate-700">
                {formatDate(order.created_at)}
              </span>
            </p>
            <p>
              Mise à jour :{' '}
              <span className="font-medium text-slate-700">
                {formatDate(order.updated_at)}
              </span>
            </p>
            <p>
              Externe :{' '}
              <span className="font-medium text-slate-700">
                {order.external_id}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Package size={18} className="text-slate-500" />
              <h2 className="font-bold text-slate-900">
                Lignes de commande
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Produits et quantités associés à cette commande.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateItem}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={16} />
            Ajouter une ligne
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center px-6 text-center">
            <Package size={28} className="text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Aucune ligne de commande
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Ajoutez un produit à cette commande.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Produit
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SKU
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quantité
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Prix unitaire
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const product = productsById.get(item.product_id)

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {item.title}
                        </p>
                        {product && (
                          <p className="mt-1 text-xs text-slate-400">
                            {product.external_id}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {item.sku || '—'}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {item.quantity}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatCurrency(item.unit_price, item.currency)}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-900">
                        {formatCurrency(item.total, item.currency)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditItem(item)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                type: 'item',
                                id: item.id,
                                label: item.title,
                              })
                            }
                            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            Supprimer
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

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock3 size={18} className="text-slate-500" />
          <h2 className="font-bold text-slate-900">Récapitulatif financier</h2>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:max-w-md sm:ml-auto">
          <div className="flex justify-between gap-6 text-slate-500">
            <span>Sous-total</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(order.subtotal, order.currency)}
            </span>
          </div>
          <div className="flex justify-between gap-6 text-slate-500">
            <span>Taxe</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(order.tax, order.currency)}
            </span>
          </div>
          <div className="flex justify-between gap-6 text-slate-500">
            <span>Livraison</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(order.shipping, order.currency)}
            </span>
          </div>
          <div className="flex justify-between gap-6 text-slate-500">
            <span>Remise</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(order.discount, order.currency)}
            </span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between gap-6">
            <span className="font-bold text-slate-900">Total</span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(order.total, order.currency)}
            </span>
          </div>
        </div>
      </div>

      {isOrderEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Modifier la commande
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Le store ne peut pas être modifié.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOrderEditOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="p-6">
              {submitError && (
                <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {submitError}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Client
                  </span>
                  <select
                    name="customer_id"
                    value={orderForm.customer_id}
                    onChange={handleOrderChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">Aucun client</option>
                    {customers
                      .filter(
                        (item) => item.store_id === order.store_id,
                      )
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {getCustomerName(item)}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Statut
                  </span>
                  <select
                    name="status"
                    value={orderForm.status}
                    onChange={handleOrderChange}
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
                    Numéro de commande
                  </span>
                  <input
                    name="order_number"
                    value={orderForm.order_number}
                    onChange={handleOrderChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Identifiant externe
                  </span>
                  <input
                    name="external_id"
                    value={orderForm.external_id}
                    onChange={handleOrderChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                {[
                  ['subtotal', 'Sous-total'],
                  ['tax', 'Taxe'],
                  ['shipping', 'Livraison'],
                  ['discount', 'Remise'],
                  ['total', 'Total'],
                ].map(([name, label]) => (
                  <label key={name} className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      {label}
                    </span>
                    <input
                      name={name}
                      type="number"
                      min="0"
                      step="0.01"
                      value={orderForm[name]}
                      onChange={handleOrderChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Devise
                  </span>
                  <input
                    name="currency"
                    maxLength={3}
                    value={orderForm.currency}
                    onChange={handleOrderChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Date de commande
                  </span>
                  <input
                    name="ordered_at"
                    type="datetime-local"
                    value={orderForm.ordered_at}
                    onChange={handleOrderChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setIsOrderEditOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingItem ? 'Modifier la ligne' : 'Ajouter une ligne'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sélectionnez un produit appartenant au store de la commande.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsItemOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="p-6">
              {submitError && (
                <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {submitError}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Produit *
                  </span>
                  <select
                    value={itemForm.product_id}
                    onChange={handleProductChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">Sélectionner un produit</option>
                    {storeProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                        {product.sku ? ` — ${product.sku}` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Titre *
                  </span>
                  <input
                    name="title"
                    value={itemForm.title}
                    onChange={handleItemChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    SKU
                  </span>
                  <input
                    name="sku"
                    value={itemForm.sku}
                    onChange={handleItemChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Identifiant externe
                  </span>
                  <input
                    name="external_id"
                    value={itemForm.external_id}
                    onChange={handleItemChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Quantité *
                  </span>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={itemForm.quantity}
                    onChange={handleItemChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>

                {[
                  ['unit_price', 'Prix unitaire'],
                  ['discount', 'Remise'],
                  ['tax', 'Taxe'],
                  ['total', 'Total'],
                ].map(([name, label]) => (
                  <label key={name} className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      {label}
                    </span>
                    <input
                      name={name}
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemForm[name]}
                      onChange={handleItemChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Devise
                  </span>
                  <input
                    name="currency"
                    maxLength={3}
                    value={itemForm.currency}
                    onChange={handleItemChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setIsItemOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {editingItem ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={19} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Confirmer la suppression
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Voulez-vous vraiment supprimer{' '}
              <span className="font-semibold text-slate-700">
                {deleteTarget.label}
              </span>
              {' ? Cette action est irréversible.'}
            </p>

            {submitError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {submitError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null)
                  setSubmitError('')
                }}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={
                  deleteTarget.type === 'order'
                    ? handleDeleteOrder
                    : handleDeleteItem
                }
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {isSubmitting && (
                  <Loader2 size={16} className="animate-spin" />
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
