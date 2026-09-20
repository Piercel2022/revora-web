import {
  BarChart3,
  Boxes,
  Cable,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  Target,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigation = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Stores',
    to: '/stores',
    icon: Store,
  },
  {
    label: 'Customers',
    to: '/customers',
    icon: Users,
  },
  {
    label: 'Products',
    to: '/products',
    icon: Package,
  },
  {
    label: 'Orders',
    to: '/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Opportunities',
    to: '/opportunities',
    icon: Target,
  },
  {
    label: 'Segments',
    to: '/segments',
    icon: Boxes,
  },
  {
    label: 'Integrations',
    to: '/integrations',
    icon: Cable,
  },
]

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-200 lg:flex lg:flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center border-b border-slate-200 px-4">
        <NavLink
          to="/dashboard"
          className={`flex min-w-0 items-center gap-3 ${
            collapsed ? 'justify-center w-full' : ''
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
            <BarChart3 size={18} />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold tracking-tight text-slate-900">
                Revora
              </div>
              <div className="text-xs text-slate-500">
                Commerce intelligence
              </div>
            </div>
          )}
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {!collapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        )}

        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}
          className="flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div
        className={`border-t border-slate-200 p-3 ${
          collapsed ? 'flex justify-center' : ''
        }`}
      >
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500"
          title={collapsed ? 'Compte utilisateur' : undefined}
        >
          <CircleUserRound size={18} />
          {!collapsed && (
            <span className="text-xs font-medium">Compte utilisateur</span>
          )}
        </div>
      </div>
    </aside>
  )
}
export default  Sidebar