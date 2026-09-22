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

const steps = [
  {
    number: '01',
    title: 'Connecter',
    description:
      'Réunissez vos Stores e-commerce et vos données opérationnelles dans un seul espace connecté.',
    icon: Store,
    items: [
      'Connecter plusieurs Stores',
      'Centraliser vos données e-commerce',
      'Garder chaque Store clairement séparé',
    ],
  },
  {
    number: '02',
    title: 'Organiser',
    description:
      'Revora structure vos données pour que Stores, Customers, Products et Orders fonctionnent ensemble.',
    icon: Database,
    items: [
      'Stores et canaux de vente',
      'Customers et historique d’achat',
      'Products et relations avec les Orders',
    ],
  },
  {
    number: '03',
    title: 'Comprendre',
    description:
      'Transformez vos données opérationnelles en une vision claire de ce qui se passe dans votre activité.',
    icon: BarChart3,
    items: [
      'Suivre le chiffre d’affaires et les Orders',
      'Comprendre l’activité de vos Customers',
      'Suivre la performance de votre activité',
    ],
  },
  {
    number: '04',
    title: 'Segmenter',
    description:
      'Créez des groupes de Customers pertinents à partir des données déjà disponibles dans Revora.',
    icon: Users,
    items: [
      'Regrouper les Customers selon leur comportement',
      'Identifier les profils clients à forte valeur',
      'Construire des Segments exploitables',
    ],
  },
  {
    number: '05',
    title: 'Identifier',
    description:
      'Allez au-delà du reporting et faites émerger les Opportunities cachées dans vos données e-commerce.',
    icon: Target,
    items: [
      'Détecter les Opportunities commerciales',
      'Prioriser les actions potentielles',
      'Relier les insights aux Customers et aux Stores',
    ],
  },
  {
    number: '06',
    title: 'Agir',
    description:
      'Utilisez votre vision connectée de l’activité pour prendre des décisions plus rapides et mieux informées.',
    icon: Zap,
    items: [
      'Vous concentrer sur les bonnes Opportunities',
      'Agir avec davantage de contexte',
      'Améliorer continuellement votre activité',
    ],
  },
]

const dataFlow = [
  {
    label: 'Stores',
    icon: Store,
  },
  {
    label: 'Customers',
    icon: Users,
  },
  {
    label: 'Products',
    icon: Package,
  },
  {
    label: 'Orders',
    icon: ShoppingCart,
  },
]

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Sparkles size={16} />
          </div>

          <span className="text-sm font-semibold text-slate-900">
            Revora Dashboard
          </span>
        </div>

        <div className="hidden items-center gap-4 text-xs text-slate-500 sm:flex">
          <span>Vue d’ensemble</span>
          <span>Customers</span>
          <span>Orders</span>
          <span>Opportunities</span>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Vue d’ensemble de l’activité
            </p>

            <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Tout est connecté.
            </h3>
          </div>

          <div className="hidden rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 sm:block">
            30 derniers jours
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ['Chiffre d’affaires', '84 240 €', '+18,4 %'],
            ['Orders', '1 284', '+12,7 %'],
            ['Customers', '8 492', '+9,2 %'],
            ['Opportunities', '146', '+24,8 %'],
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

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Chiffre d’affaires</p>

                <p className="mt-1 font-semibold text-slate-900">
                  84 240 €
                </p>
              </div>

              <BarChart3 size={18} className="text-emerald-600" />
            </div>

            <div className="mt-8 flex h-32 items-end gap-2">
              {[38, 54, 46, 68, 61, 78, 73, 92, 84, 100, 94, 108].map(
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
                <p className="text-xs text-slate-500">Opportunities</p>

                <p className="mt-1 font-semibold text-slate-900">
                  146 identifiées
                </p>
              </div>

              <Target size={18} className="text-emerald-600" />
            </div>

            <div className="mt-6 space-y-3">
              {[
                ['Customers à forte valeur', '12 480 €'],
                ['Achats récurrents', '8 920 €'],
                ['Customers inactifs', '6 740 €'],
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

function StepCard({ step }) {
  const Icon = step.icon

  return (
    <div className="group relative rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/50">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Icon size={22} />
        </div>

        <span className="text-sm font-bold tracking-widest text-slate-300">
          {step.number}
        </span>
      </div>

      <h3 className="mt-7 text-xl font-bold text-slate-950">
        {step.title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">{step.description}</p>

      <div className="mt-6 space-y-3">
        {step.items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <Check
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <span className="text-sm text-slate-600">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HowItWorksPage() {
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
              className="transition hover:text-slate-950"
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
              className="text-slate-950"
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

      {/* Hero */}
      <main>
        <section className="overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <Sparkles size={15} />
                Des données connectées à l’action
              </div>

              <h1 className="mt-7 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Une manière plus simple de{' '}
                <span className="text-emerald-600">
                  comprendre votre activité e-commerce.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Revora connecte vos Stores, Customers, Products et Orders,
                puis transforme ces données connectées en Segments, insights et
                Opportunities.
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
          </div>
        </section>

        {/* Workflow */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Le fonctionnement de Revora
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Six étapes. Un seul modèle opérationnel connecté.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Au lieu de passer d’outils déconnectés en feuilles de calcul,
                Revora vous offre un flux unique, de vos données brutes
                jusqu’à l’action commerciale.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          </div>
        </section>

        {/* Data model */}
        <section className="border-y border-slate-200 bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  Tout est connecté
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Vos données deviennent plus utiles lorsqu’elles
                  fonctionnent ensemble.
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Un Customer est lié à ses Orders. Les Orders sont liés aux
                  Products et aux Stores. Ces relations donnent à Revora le
                  contexte nécessaire pour passer de données isolées à une
                  véritable intelligence commerciale.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    'Une seule source de vérité pour votre activité e-commerce',
                    'Des relations visibles entre les éléments qui comptent',
                    'Une base pour la segmentation et la détection d’Opportunities',
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

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  {dataFlow.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <Icon size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Données connectées
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="my-5 flex justify-center">
                  <div className="h-8 w-px bg-emerald-200" />
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <Layers3 size={21} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-950">
                    Intelligence commerciale connectée
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Une vision unifiée qui donne davantage de contexte à
                    chaque décision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Une seule vue claire
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Ne construisez plus votre vision manuellement.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Revora vous donne un dashboard où les signaux importants de
                votre activité e-commerce peuvent être consultés au même
                endroit.
              </p>
            </div>

            <div className="mt-14">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Segments to opportunities */}
        <section className="bg-slate-950 py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                  De l’insight à l’Opportunity
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  L’objectif n’est pas d’avoir plus de données. C’est de
                  prendre de meilleures décisions.
                </h2>

                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                  Revora crée une chaîne entre ce qui se passe dans vos Stores
                  et ce que vous pouvez faire ensuite.
                </p>

                <div className="mt-9 space-y-4">
                  {[
                    [
                      'Données Customers',
                      'Comprendre qui achète et comment ces Customers se comportent.',
                    ],
                    [
                      'Segments',
                      'Regrouper les Customers autour de comportements significatifs.',
                    ],
                    [
                      'Opportunities',
                      'Transformer ces comportements en signaux commerciaux exploitables.',
                    ],
                  ].map(([title, description], index) => (
                    <div
                      key={title}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-400">
                        0{index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">{title}</h3>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
                  <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        Opportunity
                      </span>

                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                        Fort potentiel
                      </span>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-slate-400">
                        Segment Customer
                      </p>

                      <p className="mt-2 text-xl font-bold text-white">
                        Customers à forte valeur et récurrents
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white/5 p-4">
                          <p className="text-xs text-slate-500">Customers</p>

                          <p className="mt-1 font-semibold text-white">
                            248
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/5 p-4">
                          <p className="text-xs text-slate-500">
                            Valeur potentielle
                          </p>

                          <p className="mt-1 font-semibold text-white">
                            12 480 €
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-400">
                    <span>Données</span>

                    <ArrowRight size={15} />

                    <span>Segment</span>

                    <ArrowRight size={15} />

                    <span className="font-medium text-emerald-400">
                      Opportunity
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple onboarding */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Commencer simplement
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Vous n’avez pas besoin de reconstruire votre activité.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Commencez par connecter les données que vous avez déjà. Puis
              construisez progressivement votre vision client, vos Segments
              et vos workflows d’Opportunities.
            </p>

            <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
              {[
                [
                  'Connecter',
                  'Réunir vos données e-commerce au même endroit.',
                ],
                [
                  'Explorer',
                  'Comprendre ce qui se passe dans votre activité.',
                ],
                [
                  'Agir',
                  'Vous concentrer sur les Opportunities qui comptent.',
                ],
              ].map(([title, description], index) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Étape {index + 1}
                  </span>

                  <h3 className="mt-4 font-bold text-slate-950">{title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-20 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 text-center shadow-xl shadow-emerald-600/20 sm:px-12 lg:py-20">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à connecter votre activité e-commerce ?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
              Réunissez vos Stores, Customers, Products et Orders dans Revora.
            </p>

            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Commencer gratuitement
                <ArrowRight size={17} />
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

          <p>Intelligence commerciale connectée.</p>

          <div className="flex gap-5">
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