import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Building2,
  CircleDollarSign,
  Mail,
  Package,
  RefreshCw,
  Save,
  ShoppingCart,
  Store,
  User,
  Users,
  Workflow,
  X,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getDashboard } from '../api/client'
import { getProfile, updateProfile } from '../api/profile'
import useAuth from '../hooks/useAuth'

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('fr-FR')

const roleLabels = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
}

function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0))
}

function formatNumber(value) {
  return numberFormatter.format(Number(value || 0))
}

function KpiCard({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={19} />
        </div>
      </div>
    </div>
  )
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  )
}

function ProfileField({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={[
          'w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition',
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500'
            : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100',
        ].join(' ')}
      />
    </label>
  )
}

export default function Dashboard() {
  const { user, organization } = useAuth()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [profileOpen, setProfileOpen] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState(null)
  const [profileSuccess, setProfileSuccess] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })

  const loadDashboard = async () => {
    try {
      setError(null)
      setLoading(true)

      const data = await getDashboard()

      setDashboard(data)
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          'Impossible de charger les données du dashboard.',
      )
    } finally {
      setLoading(false)
    }
  }

  const openProfile = async () => {
    setProfileOpen(true)
    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(null)

    try {
      const data = await getProfile()

      setProfile(data)

      setProfileForm({
        first_name: data.user?.first_name || '',
        last_name: data.user?.last_name || '',
        email: data.user?.email || '',
      })
    } catch (requestError) {
      setProfileError(
        requestError.response?.data?.error ||
          'Impossible de charger votre profil.',
      )
    } finally {
      setProfileLoading(false)
    }
  }

  const closeProfile = () => {
    if (profileSaving) {
      return
    }

    setProfileOpen(false)
    setProfileError(null)
    setProfileSuccess(null)
  }

  const handleProfileChange = (event) => {
    const { name, value } = event.target

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()

    try {
      setProfileSaving(true)
      setProfileError(null)
      setProfileSuccess(null)

      const data = await updateProfile({
        first_name: profileForm.first_name.trim(),
        last_name: profileForm.last_name.trim(),
        email: profileForm.email.trim(),
      })

      setProfile(data)

      setProfileForm({
        first_name: data.user?.first_name || '',
        last_name: data.user?.last_name || '',
        email: data.user?.email || '',
      })

      setProfileSuccess('Votre profil a été mis à jour.')
    } catch (requestError) {
      const details = requestError.response?.data?.details

      setProfileError(
        Array.isArray(details) && details.length > 0
          ? details.join(', ')
          : requestError.response?.data?.error ||
              'Impossible de mettre à jour votre profil.',
      )
    } finally {
      setProfileSaving(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const fetchDashboard = async () => {
      try {
        const data = await getDashboard()

        if (!cancelled) {
          setDashboard(data)
          setError(null)
          setLoading(false)
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.error ||
              'Impossible de charger les données du dashboard.',
          )
          setLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  const orderChartData = useMemo(() => {
    if (!dashboard) {
      return []
    }

    return [
      {
        name: 'En attente',
        value: dashboard.orders.pending,
      },
      {
        name: 'Payées',
        value: dashboard.orders.paid,
      },
      {
        name: 'Expédiées',
        value: dashboard.orders.fulfilled,
      },
      {
        name: 'Annulées',
        value: dashboard.orders.cancelled,
      },
      {
        name: 'Remboursées',
        value: dashboard.orders.refunded,
      },
    ]
  }, [dashboard])

  const opportunityChartData = useMemo(() => {
    if (!dashboard) {
      return []
    }

    return [
      {
        name: 'Ouvertes',
        value: dashboard.opportunities.open,
      },
      {
        name: 'Gagnées',
        value: dashboard.opportunities.won,
      },
      {
        name: 'Perdues',
        value: dashboard.opportunities.lost,
      },
    ]
  }, [dashboard])

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <RefreshCw className="animate-spin" size={18} />
          Chargement du dashboard…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 text-red-600" size={20} />

            <div className="flex-1">
              <h1 className="font-semibold text-red-900">
                Impossible de charger le dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={loadDashboard}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                <RefreshCw size={16} />
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { kpis, stores, orders, opportunities, integrations } = dashboard

  const displayedProfile = profile || user
  const displayedOrganization = profile?.organization || organization

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Bonjour {user?.first_name},
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Tableau de bord
            </h1>

            <p className="mt-2 text-slate-500">
              Vue d’ensemble de l’activité de {organization?.name}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openProfile}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
              <User size={16} />
              Mon profil
            </button>

            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Chiffre d’affaires"
            value={formatCurrency(kpis.revenue)}
            description="Total des commandes"
            icon={CircleDollarSign}
          />

          <KpiCard
            label="Commandes"
            value={formatNumber(kpis.orders)}
            description="Commandes de l’organisation"
            icon={ShoppingCart}
          />

          <KpiCard
            label="Clients"
            value={formatNumber(kpis.customers)}
            description="Clients sur les stores"
            icon={Users}
          />

          <KpiCard
            label="Produits"
            value={formatNumber(kpis.products)}
            description="Catalogue actuel"
            icon={Package}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Pipeline commercial
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight">
                  {formatCurrency(kpis.pipeline_value)}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {formatNumber(kpis.open_opportunities)} opportunité(s)
                  ouverte(s)
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Workflow size={20} />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-slate-300">
              <ArrowUpRight size={16} />
              <span>
                {formatCurrency(opportunities.won_value)} de valeur gagnée
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Stores connectés
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {stores.active}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  sur {stores.total} store(s)
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Store size={20} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Actifs</span>
                <span className="font-medium text-slate-900">
                  {stores.active}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">En pause</span>
                <span className="font-medium text-slate-900">
                  {stores.paused}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Déconnectés</span>
                <span className="font-medium text-slate-900">
                  {stores.disconnected}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Répartition des commandes"
            description="État actuel des commandes de votre organisation."
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderChartData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    fill="#0f172a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard
            title="Pipeline commercial"
            description="Répartition des opportunités par statut."
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={opportunityChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {opportunityChartData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={
                          index === 0
                            ? '#0f172a'
                            : index === 1
                              ? '#64748b'
                              : '#cbd5e1'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-5 text-xs text-slate-500">
              {opportunityChartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  {entry.name}: {entry.value}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SectionCard
            title="Stores"
            description="État de vos boutiques."
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Building2 size={20} />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stores.total}
                </p>
                <p className="text-sm text-slate-500">store(s)</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Commandes"
            description="Volume actuel."
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <ShoppingCart size={20} />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {orders.total}
                </p>
                <p className="text-sm text-slate-500">
                  {orders.pending} en attente
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Intégrations"
            description="Connecteurs de l’organisation."
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <BarChart3 size={20} />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {integrations.active}
                </p>
                <p className="text-sm text-slate-500">
                  sur {integrations.total} active(s)
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {profileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeProfile()
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Mon profil
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Gérez les informations de votre compte utilisateur.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeProfile}
                disabled={profileSaving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fermer"
              >
                <X size={19} />
              </button>
            </div>

            {profileLoading ? (
              <div className="flex min-h-80 items-center justify-center">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <RefreshCw className="animate-spin" size={18} />
                  Chargement du profil…
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-6 px-6 py-6">
                  {profileError && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <AlertCircle
                        className="mt-0.5 shrink-0 text-red-600"
                        size={18}
                      />

                      <p className="text-sm leading-6 text-red-700">
                        {profileError}
                      </p>
                    </div>
                  )}

                  {profileSuccess && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      {profileSuccess}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProfileField
                      label="Prénom"
                      name="first_name"
                      value={profileForm.first_name}
                      onChange={handleProfileChange}
                    />

                    <ProfileField
                      label="Nom"
                      name="last_name"
                      value={profileForm.last_name}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Mail size={15} />
                      Adresse email
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Rôle
                      </span>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-600">
                        {roleLabels[displayedProfile?.role] ||
                          displayedProfile?.role ||
                          '—'}
                      </div>
                    </div>

                    <div>
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Organisation
                      </span>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-600">
                        {displayedOrganization?.name || '—'}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                        <Building2 size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Organisation
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {displayedOrganization?.slug
                            ? `Identifiant : ${displayedOrganization.slug}`
                            : 'Les informations de l’organisation sont gérées par votre organisation.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                  <button
                    type="button"
                    onClick={closeProfile}
                    disabled={profileSaving}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {profileSaving ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Enregistrement…
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
