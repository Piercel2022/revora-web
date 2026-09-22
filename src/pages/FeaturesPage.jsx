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

const features = [
  {
    number: '01',
    icon: Store,
    title: 'Gérez tous vos Stores',
    description:
      'Rassemblez vos boutiques e-commerce dans un même espace opérationnel et gardez une vision claire de chaque activité.',
    points: [
      'Vue centralisée des Stores',
      'Informations sur les plateformes et boutiques',
      'Contexte devise et fuseau horaire',
      'Gestion de chaque Store',
    ],
  },
  {
    number: '02',
    icon: Users,
    title: 'Comprenez vos Customers',
    description:
      'Conservez les informations clients connectées aux transactions et aux Stores qui comptent pour votre activité.',
    points: [
      'Profils clients',
      'Historique des commandes',
      'Relations avec les Stores',
      'Activité client',
    ],
  },
  {
    number: '03',
    icon: Package,
    title: 'Pilotez vos Products',
    description:
      'Gardez votre catalogue structuré et connecté aux Stores et aux Orders qui génèrent réellement votre activité commerciale.',
    points: [
      'Catalogue produits',
      'Associations avec les Stores',
      'Détails des Products',
      'Contexte commercial',
    ],
  },
  {
    number: '04',
    icon: ShoppingCart,
    title: 'Suivez chaque Order',
    description:
      'Visualisez vos commandes dans le contexte global de votre activité plutôt que comme des transactions isolées.',
    points: [
      'Vue d’ensemble des Orders',
      'Relations avec les Customers',
      'Relations avec les Products',
      'Contexte du chiffre d’affaires',
    ],
  },
  {
    number: '05',
    icon: Target,
    title: 'Créez des Segments pertinents',
    description:
      'Transformez vos données clients en groupes structurés pour mieux comprendre votre activité commerciale et agir au bon moment.',
    points: [
      'Segmentation des Customers',
      'Organisation des audiences',
      'Ciblage commercial',
      'Analyse des comportements clients',
    ],
  },
  {
    number: '06',
    icon: Zap,
    title: 'Identifiez vos Opportunities',
    description:
      'Donnez aux opportunités commerciales un espace dédié, directement relié aux données clients et commerciales qui les expliquent.',
    points: [
      'Pipeline d’Opportunities',
      'Valeur potentielle',
      'Contexte client',
      'Visibilité sur les suivis',
    ],
  },
]

const connectedData = [
  {
    label: 'Stores',
    description: 'Vos canaux de vente',
    icon: Store,
  },
  {
    label: 'Customers',
    description: 'Vos clients',
    icon: Users,
  },
  {
    label: 'Products',
    description: 'Votre catalogue',
    icon: Package,
  },
  {
    label: 'Orders',
    description: 'Vos transactions',
    icon: ShoppingCart,
  },
]

const dashboardMetrics = [
  ['Chiffre d’affaires', '84 240 €', '+18,4 %'],
  ['Commandes', '1 284', '+12,8 %'],
  ['Clients', '8 492', '+9,2 %'],
  ['Opportunités', '146', '+24,5 %'],
]

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-emerald-500/10 blur-3xl" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex h-11 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          </div>

          <div className="hidden h-7 w-60 items-center justify-center rounded-md border border-slate-200 bg-white text-[10px] text-slate-400 sm:flex">
            app.revora.io/dashboard
          </div>

          <div className="h-7 w-7 rounded-full bg-slate-200" />
        </div>

        <div className="grid min-h-[390px] lg:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-slate-200 bg-slate-950 p-4 lg:block">
            <div className="mb-8 flex items-center gap-2 text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
                <Layers3 size={14} />
              </div>

              <span className="text-sm font-bold">Revora</span>
            </div>

            <div className="space-y-1">
              {[
                'Dashboard',
                'Stores',
                'Customers',
                'Products',
                'Orders',
                'Segments',
                'Opportunities',
              ].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-2 text-[11px] font-medium ${
                    index === 0
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="bg-slate-50 p-5 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Vue d’ensemble
                </p>

                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  Votre activité en un coup d’œil.
                </h3>
              </div>

              <div className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-500 sm:block">
                30 derniers jours
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {dashboardMetrics.map(([label, value, change]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <p className="text-[10px] font-medium text-slate-500">
                    {label}
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className="text-lg font-semibold tracking-tight text-slate-950">
                      {value}
                    </p>

                    <span className="text-[10px] font-semibold text-emerald-600">
                      {change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-950">
                      Évolution du chiffre d’affaires
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Performance de vos Stores
                    </p>
                  </div>

                  <BarChart3 size={17} className="text-emerald-500" />
                </div>

                <div className="mt-8 flex h-28 items-end gap-2">
                  {[35, 48, 42, 66, 55, 72, 63, 84, 76, 94, 82, 100].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-slate-200"
                        style={{ height: `${height}%` }}
                      />
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-950">
                  Opportunities
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Pipeline commercial
                </p>

                <div className="mt-6">
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">
                    28,5 k€
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      ['Clients à forte valeur', '12,4 k€'],
                      ['Achats récurrents', '9,8 k€'],
                      ['Développement commercial', '6,3 k€'],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between text-[10px]"
                      >
                        <span className="text-slate-500">{label}</span>

                        <span className="font-semibold text-slate-900">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Layers3 size={19} strokeWidth={2.2} />
            </div>

            <span className="text-lg font-bold tracking-tight">
              Revora
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/product"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Produit
            </Link>

            <Link
              to="/features"
              className="text-sm font-semibold text-slate-950"
            >
              Fonctionnalités
            </Link>

            <Link
              to="/how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Comment ça marche
            </Link>

            <Link
              to="/pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Tarifs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 sm:block"
            >
              Se connecter
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Commencer
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-20 pt-20 sm:pb-24 sm:pt-24 lg:px-8 lg:pt-28">
          <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_52%)]" />

          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
                <Sparkles size={13} />
                Une plateforme connectée
              </div>

              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Tout ce qu’il vous faut pour piloter votre{' '}
                <span className="text-emerald-600">
                  activité e-commerce.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Revora connecte vos Stores, Customers, Products, Orders et
                Opportunities pour vous permettre de comprendre votre activité
                et d’agir avec le bon contexte.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
                >
                  Commencer gratuitement
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
                >
                  Découvrir comment ça marche
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className="mx-auto mt-20 max-w-6xl lg:mt-24">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Connected data */}
        <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-emerald-600">
                  Un modèle de données connecté
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Votre activité est connectée.
                  <br />
                  Vos outils doivent l’être aussi.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                  Les Customers sont liés aux Orders. Les Orders sont liés aux
                  Products. Les Products appartiennent aux Stores. Revora rend
                  ces relations visibles au lieu de les disperser entre
                  plusieurs outils.
                </p>

                <Link
                  to="/how-it-works"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-emerald-600"
                >
                  Découvrir comment Revora connecte vos données
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  {connectedData.map(({ label, description, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-200">
                        <Icon size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          {label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="my-5 flex items-center justify-center">
                  <div className="h-px flex-1 bg-slate-200" />

                  <div className="mx-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <Layers3 size={17} />
                  </div>

                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="rounded-2xl bg-slate-950 p-5 text-center text-white">
                  <p className="text-sm font-semibold">
                    Une seule vue opérationnelle
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Toutes vos données connectées autour de votre activité
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-600">
                Fonctionnalités principales
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Tout ce dont votre équipe a besoin pour comprendre et piloter
                votre activité e-commerce.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                De la première connexion d’un Store à l’identification d’une
                nouvelle opportunité commerciale, Revora donne à chaque élément
                important de votre activité une place connectée.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <article
                    key={feature.number}
                    className="group rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                        <Icon size={20} />
                      </div>

                      <span className="text-xs font-bold tracking-[0.2em] text-slate-300">
                        {feature.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-xl font-bold tracking-tight text-slate-950">
                      {feature.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {feature.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-sm text-slate-600"
                        >
                          <Check
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600"
                          />

                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Opportunities */}
        <section className="border-y border-slate-200 bg-slate-950 px-6 py-20 text-white sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-emerald-400">
                  Des données aux Opportunities
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Ne vous contentez pas de collecter vos données.
                  <br />
                  Sachez quoi en faire.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                  Revora connecte l’activité de vos Customers aux Segments et
                  aux Opportunities pour donner à votre équipe un chemin plus
                  clair entre l’information et l’action commerciale.
                </p>

                <Link
                  to="/register"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Commencer à identifier vos Opportunities
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <div className="grid gap-3">
                  {[
                    [
                      'Activité client',
                      'Comprendre ce qui se passe',
                    ],
                    [
                      'Segments',
                      'Organiser vos audiences pertinentes',
                    ],
                    [
                      'Opportunities',
                      'Identifier la valeur potentielle',
                    ],
                    [
                      'Action',
                      'Définir votre prochaine action',
                    ],
                  ].map(([label, description], index) => (
                    <div key={label}>
                      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950">
                          0{index + 1}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {label}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {description}
                          </p>
                        </div>
                      </div>

                      {index < 3 && (
                        <div className="ml-9 h-3 w-px bg-white/10" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scale */}
        <section className="px-6 py-20 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-10 lg:p-14">
              <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold text-emerald-600">
                    Pensé pour accompagner votre croissance
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Commencez simplement.
                    <br />
                    Développez votre activité avec Revora.
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                    Que vous gériez un seul Store ou plusieurs activités
                    e-commerce, Revora vous apporte une base structurée qui
                    peut évoluer avec votre équipe et vos opérations.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {[
                      'Gestion de plusieurs Stores',
                      'Données clients connectées',
                      'Catalogue Products structuré',
                      'Opportunities commerciales',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 text-sm font-medium text-slate-700"
                      >
                        <Check size={16} className="text-emerald-600" />

                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                      <Database size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        Une base connectée
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Construite autour de votre activité e-commerce
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      'Stores',
                      'Customers',
                      'Products',
                      'Orders',
                      'Segments',
                      'Opportunities',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {item}
                        </span>

                        <span className="text-xs font-semibold text-emerald-600">
                          Connecté
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-24 pt-4 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl bg-emerald-600 px-6 py-14 text-center sm:px-12 sm:py-16">
            <Sparkles className="mx-auto h-8 w-8 text-white" />

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Votre activité e-commerce mérite une seule vue claire.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-emerald-50">
              Rassemblez vos Stores, Customers, Products, Orders et
              Opportunities avec Revora.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 sm:w-auto"
              >
                Commencer gratuitement
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Voir les tarifs
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© {new Date().getFullYear()} Revora</span>

          <div className="flex items-center gap-5">
            <Link
              to="/product"
              className="transition hover:text-slate-900"
            >
              Produit
            </Link>

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