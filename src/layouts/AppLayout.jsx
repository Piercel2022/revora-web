import { LogOut, Store } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import useAuth from '../auth/useAuth'

export default function AppLayout() {
  const { user, organization, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Store size={18} />
            </div>

            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900">
                Revora
              </div>
              <div className="text-xs text-slate-500">
                {organization?.name}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-slate-900">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
