import { Menu, X, LogOut } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import Sidebar from '../components/Sidebar'

const mobileNavigation = [
  {
    label: 'Dashboard',
    to: '/dashboard',
  },
  {
    label: 'Stores',
    to: '/stores',
  },
  {
    label: 'Customers',
    to: '/customers',
  },
  {
    label: 'Products',
    to: '/products',
  },
  {
    label: 'Orders',
    to: '/orders',
  },
  {
    label: 'Opportunities',
    to: '/opportunities',
  },
  {
    label: 'Segments',
    to: '/segments',
  },
  {
    label: 'Integrations',
    to: '/integrations',
  },
]

export default function AppLayout() {
  const { user, organization, logout } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((value) => !value)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                  aria-label={
                    mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
                  }
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 lg:hidden"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <span className="text-sm font-bold">R</span>
                  </div>

                  <div className="hidden sm:block">
                    <div className="text-sm font-bold tracking-tight text-slate-900">
                      Revora
                    </div>
                    <div className="text-xs text-slate-500">
                      {organization?.name}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-medium text-slate-900">
                    {user?.first_name} {user?.last_name}
                  </div>

                  <div className="text-xs text-slate-500">
                    {user?.role}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  title="Déconnexion"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">Déconnexion</span>
                </button>
              </div>
            </div>
          </header>

          {mobileMenuOpen && (
            <div className="border-b border-slate-200 bg-white lg:hidden">
              <nav className="space-y-1 p-3">
                {mobileNavigation.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}