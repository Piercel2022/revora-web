import { ArrowRight, Building2, Users, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuth from '../auth/useAuth'

export default function Dashboard() {
  const { user, organization } = useAuth()

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          Bonjour {user?.first_name},
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Tableau de bord
        </h1>

        <p className="mt-2 text-slate-500">
          Bienvenue dans l’espace de gestion de {organization?.name}.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Link
          to="/stores"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
          <Building2 className="text-slate-500" size={22} />

          <h2 className="mt-5 font-semibold text-slate-900">Stores</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Gérez les boutiques connectées à votre organisation.
          </p>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            Ouvrir
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Users className="text-slate-500" size={22} />

          <h2 className="mt-5 font-semibold text-slate-900">Customers</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            La gestion des clients arrive dans le prochain jalon.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ShoppingBag className="text-slate-500" size={22} />

          <h2 className="mt-5 font-semibold text-slate-900">Orders</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            La gestion des commandes arrivera après les stores.
          </p>
        </div>
      </div>
    </div>
  )
}
