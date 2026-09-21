import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Archive,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { createProduct, getProducts } from '../api/products'
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

const emptyForm = {
  store_id: '',
  external_id: '',
  title: '',
  description: '',
  sku: '',
  product_type: '',
  status: 'active',
  price: '',
  currency: 'EUR',
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

function getProductName(product) {
  return product.title || product.name || 'Produit sans nom'
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [storesLoading, setStoresLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getProducts()
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(
          err.response?.data?.error ||
            'Impossible de charger les produits.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const loadStores = async () => {
      try {
        setStoresLoading(true)
        const data = await getStores()
        setStores(Array.isArray(data) ? data : [])
      } catch {
        setStores([])
      } finally {
        setStoresLoading(false)
      }
    }

    loadStores()
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    if (!normalizedSearch) {
      return products
    }

    return products.filter((product) => {
      const values = [
        product.title,
        product.external_id,
        product.sku,
        product.product_type,
        product.status,
      ]

      return values.some((value) =>
        String(value || '').toLowerCase().includes(normalizedSearch),
      )
    })
  }, [products, search])

  const activeCount = products.filter(
    (product) => product.status === 'active',
  ).length

  const draftCount = products.filter(
    (product) => product.status === 'draft',
  ).length

  const archivedCount = products.filter(
    (product) => product.status === 'archived',
  ).length

  const handleOpenCreate = () => {
    setForm(emptyForm)
    setFormError('')
    setShowCreateModal(true)
  }

  const handleCloseCreate = () => {
    if (saving) {
      return
    }

    setShowCreateModal(false)
    setFormError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.store_id) {
      setFormError('Sélectionnez un store.')
      return
    }

    if (!form.external_id.trim()) {
      setFormError("L'identifiant externe est obligatoire.")
      return
    }

    if (!form.title.trim()) {
      setFormError('Le nom du produit est obligatoire.')
      return
    }

    if (!form.currency.trim()) {
      setFormError('La devise est obligatoire.')
      return
    }

    if (form.price !== '' && Number(form.price) < 0) {
      setFormError('Le prix doit être supérieur ou égal à 0.')
      return
    }

    try {
      setSaving(true)

      const payload = {
        store_id: form.store_id,
        external_id: form.external_id.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        sku: form.sku.trim(),
        product_type: form.product_type.trim(),
        status: form.status,
        currency: form.currency.trim().toUpperCase(),
        price: form.price === '' ? null : Number(form.price),
      }

      const createdProduct = await createProduct(payload)

      setProducts((current) => [createdProduct, ...current])
      setShowCreateModal(false)
      setForm(emptyForm)
    } catch (err) {
      const validationErrors = err.response?.data?.errors

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setFormError(validationErrors.join(', '))
      } else {
        setFormError(
          err.response?.data?.error ||
            'Impossible de créer le produit.',
        )
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Catalogue
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Products
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Gérez le catalogue produit de votre organisation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={storesLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={17} />
          Nouveau produit
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total</p>
            <Package size={18} className="text-slate-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {products.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">Produits catalogue</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Active</p>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {activeCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Produits disponibles
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Draft</p>
            <Clock3 size={18} className="text-amber-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {draftCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Produits en préparation
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Archived</p>
            <Archive size={18} className="text-slate-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {archivedCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Produits archivés
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <div className="relative max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        {error ? (
          <div className="p-8">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          </div>
        ) : loading ? (
          <div className="p-8 text-sm text-slate-500">
            Chargement des produits...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Package size={21} />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-slate-900">
              {search
                ? 'Aucun produit trouvé'
                : 'Aucun produit pour le moment'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? 'Essayez une autre recherche.'
                : 'Créez votre premier produit pour commencer votre catalogue.'}
            </p>

            {!search && (
              <button
                type="button"
                onClick={handleOpenCreate}
                disabled={storesLoading}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                Créer un produit
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Produit
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    SKU
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Store
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Prix
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Statut
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const status =
                    STATUS_CONFIG[product.status] ||
                    STATUS_CONFIG.draft
                  const StatusIcon = status.icon
                  const store = stores.find(
                    (item) => item.id === product.store_id,
                  )

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/products/${product.id}`}
                          className="group block"
                        >
                          <p className="font-medium text-slate-900 group-hover:text-slate-700">
                            {getProductName(product)}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {product.external_id}
                          </p>
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {product.sku || '—'}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {store?.name || product.store_id || '—'}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {formatPrice(product.price, product.currency)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          <StatusIcon size={13} />
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/products/${product.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label={`Voir ${getProductName(product)}`}
                        >
                          <ChevronRight size={17} />
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Nouveau produit
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ajoutez un produit à votre catalogue.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreate}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {formError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="product-store"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Store
                  </label>

                  <select
                    id="product-store"
                    name="store_id"
                    value={form.store_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option value="">Sélectionner un store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="product-title"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Nom
                  </label>

                  <input
                    id="product-title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Ex. Premium Hoodie"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-external-id"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    External ID
                  </label>

                  <input
                    id="product-external-id"
                    name="external_id"
                    type="text"
                    value={form.external_id}
                    onChange={handleChange}
                    required
                    placeholder="shopify_12345"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-sku"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    SKU
                  </label>

                  <input
                    id="product-sku"
                    name="sku"
                    type="text"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="SKU-001"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-type"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Type
                  </label>

                  <input
                    id="product-type"
                    name="product_type"
                    type="text"
                    value={form.product_type}
                    onChange={handleChange}
                    placeholder="Apparel"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-price"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Prix
                  </label>

                  <input
                    id="product-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-currency"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Devise
                  </label>

                  <input
                    id="product-currency"
                    name="currency"
                    type="text"
                    maxLength="3"
                    value={form.currency}
                    onChange={handleChange}
                    placeholder="EUR"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-status"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Statut
                  </label>

                  <select
                    id="product-status"
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
                    htmlFor="product-description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="product-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Description du produit..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseCreate}
                  disabled={saving}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving || storesLoading}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Création...' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
