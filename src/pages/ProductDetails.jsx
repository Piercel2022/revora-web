import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Edit3,
  Package,
  Trash2,
  X,
} from 'lucide-react'
import {
  deleteProduct,
  getProduct,
  updateProduct,
} from '../api/products'
import { getStores } from '../api/stores'

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
  },
  draft: {
    label: 'Draft',
    className: 'bg-amber-50 text-amber-700',
    icon: Clock3,
  },
  archived: {
    label: 'Archived',
    className: 'bg-slate-100 text-slate-600',
    icon: Archive,
  },
}

function formatPrice(price, currency = 'EUR') {
  if (price === null || price === undefined || price === '') {
    return '—'
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(Number(price))
}

function getErrorMessage(error, fallback) {
  const responseData = error.response?.data

  if (Array.isArray(responseData?.errors)) {
    return responseData.errors.join(', ')
  }

  if (typeof responseData?.error === 'string') {
    return responseData.error
  }

  if (typeof responseData?.message === 'string') {
    return responseData.message
  }

  return fallback
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const [form, setForm] = useState({
    external_id: '',
    title: '',
    description: '',
    sku: '',
    product_type: '',
    status: 'active',
    price: '',
    currency: 'EUR',
  })

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const [productData, storesData] = await Promise.all([
          getProduct(id),
          getStores(),
        ])

        setProduct(productData)
        setStores(Array.isArray(storesData) ? storesData : [])
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            'Impossible de charger le produit.',
          ),
        )
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])


  const store = stores.find((item) => item.id === product?.store_id)

  const status =
    STATUS_CONFIG[product?.status] || STATUS_CONFIG.draft

  const StatusIcon = status.icon

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleOpenEdit = () => {
    setForm({
      external_id: product.external_id || '',
      title: product.title || '',
      description: product.description || '',
      sku: product.sku || '',
      product_type: product.product_type || '',
      status: product.status || 'active',
      price:
        product.price === null || product.price === undefined
          ? ''
          : String(product.price),
      currency: product.currency || 'EUR',
    })

    setActionError('')
    setShowEditModal(true)
  }

  const handleCloseEdit = () => {
    if (saving) {
      return
    }

    setShowEditModal(false)
    setActionError('')
  }

  const handleSubmitEdit = async (event) => {
    event.preventDefault()
    setActionError('')

    if (!form.external_id.trim()) {
      setActionError("L'identifiant externe est obligatoire.")
      return
    }

    if (!form.title.trim()) {
      setActionError('Le nom du produit est obligatoire.')
      return
    }

    if (!form.currency.trim()) {
      setActionError('La devise est obligatoire.')
      return
    }

    if (form.price !== '' && Number(form.price) < 0) {
      setActionError('Le prix doit être supérieur ou égal à 0.')
      return
    }

    try {
      setSaving(true)

      const payload = {
        external_id: form.external_id.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        sku: form.sku.trim(),
        product_type: form.product_type.trim(),
        status: form.status,
        currency: form.currency.trim().toUpperCase(),
        price: form.price === '' ? null : Number(form.price),
      }

      const updatedProduct = await updateProduct(id, payload)

      setProduct(updatedProduct)
      setShowEditModal(false)
    } catch (err) {
      setActionError(
        getErrorMessage(
          err,
          'Impossible de modifier le produit.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setActionError('')

    try {
      setDeleting(true)

      await deleteProduct(id)

      navigate('/products', { replace: true })
    } catch (err) {
      setDeleting(false)
      setActionError(
        getErrorMessage(
          err,
          'Impossible de supprimer ce produit. Il peut être utilisé par des commandes existantes.',
        ),
      )
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Chargement du produit...
          </p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-5xl">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Retour aux produits
        </Link>

        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error || 'Produit introuvable.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Retour aux produits
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Edit3 size={16} />
            Modifier
          </button>

          <button
            type="button"
            onClick={() => {
              setActionError('')
              setShowDeleteModal(true)
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Package size={25} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {product.title || 'Produit sans nom'}
                  </h1>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                  >
                    <StatusIcon size={13} />
                    {status.label}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {product.external_id}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Prix
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-0 sm:grid-cols-2">
          <div className="border-b border-slate-100 p-6 sm:border-r">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Store
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {store?.name || product.store_id || '—'}
            </p>
          </div>

          <div className="border-b border-slate-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              SKU
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {product.sku || '—'}
            </p>
          </div>

          <div className="border-b border-slate-100 p-6 sm:border-r">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Type
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {product.product_type || '—'}
            </p>
          </div>

          <div className="border-b border-slate-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Devise
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {product.currency || '—'}
            </p>
          </div>

          <div className="border-b border-slate-100 p-6 sm:border-r">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              External ID
            </p>
            <p className="mt-2 break-all text-sm font-medium text-slate-900">
              {product.external_id || '—'}
            </p>
          </div>

          <div className="border-b border-slate-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Product ID
            </p>
            <p className="mt-2 break-all text-sm font-medium text-slate-900">
              {product.id}
            </p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Description
          </p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {product.description || 'Aucune description renseignée.'}
          </p>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Modifier le produit
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Le Store ne peut pas être modifié après création.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6">
              {actionError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Store
                  </label>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500">
                    {store?.name || product.store_id || '—'}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-product-title"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Nom
                  </label>

                  <input
                    id="edit-product-title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-product-external-id"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    External ID
                  </label>

                  <input
                    id="edit-product-external-id"
                    name="external_id"
                    type="text"
                    value={form.external_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-product-sku"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    SKU
                  </label>

                  <input
                    id="edit-product-sku"
                    name="sku"
                    type="text"
                    value={form.sku}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-product-type"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Type
                  </label>

                  <input
                    id="edit-product-type"
                    name="product_type"
                    type="text"
                    value={form.product_type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-product-price"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Prix
                  </label>

                  <input
                    id="edit-product-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-product-currency"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Devise
                  </label>

                  <input
                    id="edit-product-currency"
                    name="currency"
                    type="text"
                    maxLength="3"
                    value={form.currency}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-product-status"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Statut
                  </label>

                  <select
                    id="edit-product-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="edit-product-description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="edit-product-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={saving}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Supprimer ce produit ?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cette action supprimera définitivement{' '}
              <span className="font-medium text-slate-700">
                {product.title}
              </span>
              .
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Un produit associé à des lignes de commande ne peut pas
              être supprimé.
            </p>

            {actionError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {actionError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setActionError('')
                }}
                disabled={deleting}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
