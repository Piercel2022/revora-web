import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Database,
  Layers3,
  Package,
  ShoppingCart,
  Sparkles,
  Store,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const entities = [
  {
    title: 'Stores',
    description:
      'Rassemblez tous vos canaux de vente dans une seule vue opérationnelle.',
    icon: Store,
  },
  {
    title: 'Customers',
    description:
      'Construisez une vision complète de vos clients et de leurs comportements.',
    icon: Users,
  },
  {
    title: 'Products',
    description:
      'Gardez votre catalogue et la performance de vos produits connectés.',
    icon: Package,
  },
  {
    title: 'Orders',
    description:
      'Suivez vos transactions et votre activité commerciale au même endroit.',
    icon: ShoppingCart,
  },
]

const productLayers = [
  {
    number: '01',
    title: 'Données e-commerce',
    description:
      'Revora rassemble les principales données de votre activité dans un modèle connecté.',
    icon: Database,
  },
  {
    number: '02',
    title: 'Business Intelligence',
    description:
      'Vos données connectées deviennent des dashboards, des indicateurs, des segments et des signaux.',
    icon: BarChart3,
  },
  {
    number: '03',
    title: 'Opportunités',
    description:
      'Revora vous aide à passer de l’information à des opportunités commerciales concrètes.',
    icon: Target,
  },
  {
    number: '04',
    title: 'Action',
    description:
      'Utilisez le contexte autour de chaque opportunité pour décider des prochaines actions.',
    icon: Zap,
  },
]

function ProductDashboard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Sparkles size={16} />
          </div>

          <span className="text-sm font-semibold text-slate-900">
            Revora
          </span>
        </div>

        <div className="hidden items-center gap-5 text-xs text-slate-500 sm:flex">
          <span className="font-medium text-slate-900">Dashboard</span>
          <span>Stores</span>
          <span>Customers</span>
          <span>Products</span>
          <span>Orders</span>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-slate-500">Vue d’ensemble</p>

            <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Votre activité, connectée.
            </h3>
          </div>

          <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
            30 derniers jours
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            ['Chiffre d’affaires', '84 240 €', '+18,4 %'],
            ['Commandes', '1 284', '+12,7 %'],
            ['Clients', '8 492', '+9,2 %'],
            ['Opportunités', '146', '+24,8 %'],
          ].map(([label, value, change]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="text-xs text-slate-500">{label}</p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {value}
              </p>

              <p className="mt-1 text-xs font-medium text-emerald-600">
                {change}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Évolution du chiffre d’affaires
                </p>

                <p className="mt-1 text-lg font-bold text-slate-950">
                  84 240 €
                </p>
              </div>

              <BarChart3 size={18} className="text-emerald-600" />
            </div>

            <div className="mt-8 flex h-32 items-end gap-2">
              {[42, 58, 48, 70, 62, 76, 72, 91, 82, 102, 94, 112].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-emerald-100"
                    style={{ height: `${height}px` }}
                  />
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Signaux commerciaux
                </p>

                <p className="mt-1 text-lg font-bold text-slate-950">
                  146 opportunités
                </p>
              </div>

              <Target size={18} className="text-emerald-600" />
            </div>

            <div className="mt-6 space-y-3">
              {[
                ['Clients à forte valeur', '12 480 €'],
                ['Achats récurrents', '8 920 €'],
                ['Clients inactifs', '6 740 €'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
                >
                  <span className="text-xs text-slate-600">{label}</span>

                  <span className="text-xs font-semibold text-slate-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
              R
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-950">
              Revora
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link
              to="/product"
              className="text-slate-950"
            >
              Produit
            </Link>

            <Link
              to="/features"
              className="transition hover:text-slate-950"
            >
              Fonctionnalités
            </Link>

            <Link
              to="/how-it-works"
              className="transition hover:text-slate-950"
            >
              Comment ça marche
            </Link>

            <Link
              to="/pricing"
              className="transition hover:text-slate-950"
            >
              Tarifs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-semibold text-slate-600 transition hover:text-slate-950 sm:block"
            >
              Se connecter
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Commencer
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <Layers3 size={15} />
                La plateforme Revora
              </div>

              <h1 className="mt-7 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Un système connecté pour{' '}
                <span className="text-emerald-600">
                  toute votre activité e-commerce.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Revora connecte les données de votre activité e-commerce dans
                un même modèle opérationnel : Stores, Orders, Customers,
                Segments et Opportunities.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  Commencer gratuitement
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                >
                  Découvrir les fonctionnalités
                  <ChevronRight size={17} />
                </Link>
              </div>
            </div>

            <div className="mt-16 lg:mt-20">
              <ProductDashboard />
            </div>
          </div>
        </section>

        {/* Core concept */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  Le principe
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Vos données e-commerce doivent fonctionner comme un seul
                  système.
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Une activité e-commerce repose souvent sur plusieurs outils,
                  exports et tableaux. Revora adopte une autre approche :
                  connecter les éléments qui décrivent votre activité et
                  rendre leurs relations réellement utiles.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    'Les Stores sont connectés aux Orders.',
                    'Les Orders sont connectés aux Customers et aux Products.',
                    'Les comportements clients alimentent les Segments.',
                    'Les Segments apportent du contexte aux Opportunities.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={13} />
                      </div>

                      <span className="text-sm leading-6 text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: 'Stores',
                      sublabel: 'Canaux de vente',
                      icon: Store,
                    },
                    {
                      label: 'Customers',
                      sublabel: 'Vos clients',
                      icon: Users,
                    },
                    {
                      label: 'Products',
                      sublabel: 'Ce que vous vendez',
                      icon: Package,
                    },
                    {
                      label: 'Orders',
                      sublabel: 'Votre activité commerciale',
                      icon: ShoppingCart,
                    },
                  ].map(({ label, sublabel, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Icon size={19} />
                      </div>

                      <p className="mt-4 font-semibold text-slate-950">
                        {label}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {sublabel}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="my-5 flex items-center justify-center">
                  <div className="h-8 w-px bg-emerald-200" />
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <Database size={19} />
                  </div>

                  <p className="mt-3 font-bold text-slate-950">
                    Données e-commerce connectées
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Un modèle. Plus de contexte. De meilleures décisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Entities */}
        <section className="border-y border-slate-200 bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Le modèle e-commerce
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Les briques essentielles de votre activité.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Revora part des éléments fondamentaux de votre activité
                e-commerce et les connecte dans un modèle que vous pouvez
                réellement piloter.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {entities.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-950">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product layers */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  Plus qu'une base de données
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  De la donnée à l'intelligence.
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  La valeur de Revora vient des différentes couches construites
                  à partir de vos données e-commerce connectées.
                </p>

                <Link
                  to="/how-it-works"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  Découvrir comment ça fonctionne
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="space-y-4">
                {productLayers.map(
                  ({ number, title, description, icon: Icon }) => (
                    <div
                      key={number}
                      className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Icon size={20} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-bold text-slate-950">
                            {title}
                          </h3>

                          <span className="text-xs font-bold tracking-widest text-slate-300">
                            {number}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {description}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Segments */}
        <section className="bg-slate-950 py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                  Couche d'intelligence
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Comprenez vos clients au-delà de chaque commande.
                </h2>

                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                  Revora transforme l'historique de vos clients et de vos
                  commandes en Segments capables de révéler des tendances
                  significatives dans votre activité.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    'Clients à forte valeur',
                    'Clients récurrents',
                    'Clients inactifs',
                    'Nouveaux groupes de clients',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <Check size={15} className="text-emerald-400" />

                      <span className="text-sm text-slate-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">
                        Segment client
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        Clients récurrents à forte valeur
                      </p>
                    </div>

                    <Users size={18} className="text-emerald-400" />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-slate-500">Clients</p>

                      <p className="mt-1 text-lg font-bold text-white">
                        248
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-slate-500">
                        Chiffre d'affaires généré
                      </p>

                      <p className="mt-1 text-lg font-bold text-white">
                        42,8 K€
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-emerald-500/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                      <Target size={15} />
                      Opportunité détectée
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Ce segment présente un comportement d'achat récurrent et
                      une valeur commerciale significative.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Pensé à se connecter
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Gardez votre écosystème e-commerce connecté.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Revora est conçu autour des intégrations afin que vos données
                opérationnelles puissent alimenter la plateforme sans créer
                un nouveau système isolé.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
              {[
                [
                  'Plateformes e-commerce',
                  'Rassemblez vos différents canaux de vente.',
                ],
                [
                  'Données commerciales',
                  'Gardez vos principales données synchronisées.',
                ],
                [
                  'Futures intégrations',
                  'Étendez votre environnement à mesure que vous grandissez.',
                ],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Layers3 size={19} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-950">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/features"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Découvrir toutes les fonctionnalités
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-20 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 text-center shadow-xl shadow-emerald-600/20 sm:px-12 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Transformez vos données e-commerce en un système connecté.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
              Commencez avec vos Stores et construisez progressivement une
              vision connectée de votre activité.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Commencer gratuitement
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-400 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Voir les tarifs
                <ChevronRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
              R
            </div>

            <span className="font-semibold text-slate-900">Revora</span>
          </div>

          <p>Commerce Intelligence pour les entreprises e-commerce.</p>

          <div className="flex gap-5">
            <Link
              to="/features"
              className="transition hover:text-slate-900"
            >
              Fonctionnalités
            </Link>

            <Link
              to="/how-it-works"
              className="transition hover:text-slate-900"
            >
              Comment ça marche
            </Link>

            <Link
              to="/pricing"
              className="transition hover:text-slate-900"
            >
              Tarifs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}