import {
  ArrowRight,
  BarChart3,
  Check,
  Crown,
  Database,
  Headphones,
  Layers3,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    description: 'Pour commencer à structurer votre activité e-commerce.',
    monthly: 29,
    annual: 290,
    icon: Zap,
    features: [
      '1 boutique',
      'Clients & segments',
      'Produits & commandes',
      'Tableau de bord',
      'Opportunités commerciales',
      'Support par email',
    ],
  },
  {
    name: 'Growth',
    description: 'Pour les équipes qui veulent centraliser et développer leur activité.',
    monthly: 79,
    annual: 790,
    popular: true,
    icon: Sparkles,
    features: [
      'Jusqu’à 5 boutiques',
      'Tout le plan Starter',
      'Segmentation avancée',
      'Pipeline commercial',
      'Analyses de performance',
      'Intégrations',
      'Support prioritaire',
    ],
  },
  {
    name: 'Scale',
    description: 'Pour les entreprises qui ont besoin de profondeur et de contrôle.',
    monthly: 149,
    annual: 1490,
    icon: Crown,
    features: [
      'Boutiques illimitées',
      'Tout le plan Growth',
      'Reporting avancé',
      'Données centralisées',
      'Accès équipe avancé',
      'Accompagnement prioritaire',
      'Support dédié',
    ],
  },
]

const benefits = [
  {
    icon: Database,
    title: 'Une seule source de vérité',
    description:
      'Centralisez boutiques, clients, produits, commandes et opportunités dans un même espace.',
  },
  {
    icon: BarChart3,
    title: 'Pilotez avec vos données',
    description:
      'Transformez vos données commerciales en informations directement exploitables.',
  },
  {
    icon: Layers3,
    title: 'Conçu pour évoluer',
    description:
      'Commencez simplement puis ajoutez boutiques, équipes et intégrations au fur et à mesure.',
  },
  {
    icon: ShieldCheck,
    title: 'Vos données restent structurées',
    description:
      'Une architecture pensée pour conserver une vision cohérente de votre activité.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <span className="text-sm font-bold">R</span>
            </div>

            <span className="text-lg font-bold tracking-tight">Revora</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Se connecter
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Commencer
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="px-4 pb-16 pt-20 sm:px-6 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <Sparkles size={14} />
              Une tarification simple et transparente
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Un Revora adapté à la taille de votre activité.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Centralisez vos opérations e-commerce, comprenez vos clients et
              transformez vos données en opportunités de croissance.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Annuel
              </span>

              <span className="px-4 py-2 text-sm font-medium text-slate-500">
                Économisez avec l’annuel
              </span>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon

              return (
                <article
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-7 ${
                    plan.popular
                      ? 'border-slate-900 bg-slate-950 text-white shadow-xl'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-sm ring-1 ring-slate-200">
                      Le plus populaire
                    </div>
                  )}

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      plan.popular
                        ? 'bg-white/10 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <Icon size={21} />
                  </div>

                  <h2
                    className={`mt-6 text-xl font-bold ${
                      plan.popular ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {plan.name}
                  </h2>

                  <p
                    className={`mt-2 min-h-12 text-sm leading-6 ${
                      plan.popular ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div className="mt-7">
                    <div className="flex items-end gap-1">
                      <span
                        className={`text-4xl font-bold tracking-tight ${
                          plan.popular ? 'text-white' : 'text-slate-950'
                        }`}
                      >
                        {plan.annual}€
                      </span>

                      <span
                        className={`mb-1 text-sm ${
                          plan.popular ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        / an
                      </span>
                    </div>

                    <p
                      className={`mt-1 text-xs ${
                        plan.popular ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      soit {plan.monthly}€ / mois
                    </p>
                  </div>

                  <Link
                    to="/register"
                    className={`mt-7 flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
                      plan.popular
                        ? 'bg-white text-slate-950 hover:bg-slate-100'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    Commencer avec {plan.name}
                    <ArrowRight size={16} />
                  </Link>

                  <div
                    className={`my-7 h-px ${
                      plan.popular ? 'bg-white/10' : 'bg-slate-200'
                    }`}
                  />

                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      plan.popular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Inclus
                  </p>

                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-3 text-sm ${
                          plan.popular ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        <Check
                          size={17}
                          className={`mt-0.5 shrink-0 ${
                            plan.popular ? 'text-white' : 'text-slate-900'
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-slate-500">
                Pourquoi Revora ?
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Plus qu’un tableau de bord.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                Revora rassemble les données essentielles de votre activité
                pour vous permettre de passer de données dispersées à une
                vision opérationnelle claire.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon

                return (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-slate-950">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {benefit.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl bg-slate-950 px-6 py-12 text-center sm:px-12">
            <Headphones className="mx-auto h-8 w-8 text-white" />

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white">
              Vous avez une activité plus complexe ?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Si vous gérez plusieurs boutiques, une équipe importante ou des
              besoins spécifiques, parlons de votre configuration.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Commencer avec Revora
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Revora</span>

          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="transition hover:text-slate-900"
            >
              Accueil
            </Link>

            <Link
              to="/login"
              className="transition hover:text-slate-900"
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="transition hover:text-slate-900"
            >
              Inscription
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}