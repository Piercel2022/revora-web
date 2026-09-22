import {
  ArrowRight,
  Check,
  ChevronRight,
  Database,
  Layers3,
  Menu,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Database,
    title: "Une seule source de vérité",
    description:
      "Connectez vos boutiques et centralisez les données qui comptent dans un seul espace.",
  },
  {
    icon: Users,
    title: "Une meilleure connaissance client",
    description:
      "Reliez clients, commandes et produits pour comprendre réellement les comportements d'achat.",
  },
  {
    icon: Target,
    title: "Des opportunités plus visibles",
    description:
      "Transformez vos données et segments en signaux commerciaux exploitables.",
  },
];

const signals = [
  "Revenue",
  "Orders",
  "Customers",
  "Products",
  "Segments",
  "Opportunities",
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-emerald-500/10 blur-3xl" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          </div>

          <div className="hidden h-7 w-64 items-center justify-center rounded-md border border-slate-200 bg-white text-[10px] text-slate-400 sm:flex">
            app.revora.io/dashboard
          </div>

          <div className="h-7 w-7 rounded-full bg-slate-200" />
        </div>

        <div className="grid min-h-[430px] lg:grid-cols-[190px_1fr]">
          <aside className="hidden border-r border-slate-200 bg-slate-950 p-4 lg:block">
            <div className="mb-8 flex items-center gap-2 text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
                <Layers3 size={14} />
              </div>

              <span className="text-sm font-bold">Revora</span>
            </div>

            <div className="space-y-1">
              {[
                "Dashboard",
                "Stores",
                "Customers",
                "Products",
                "Orders",
                "Segments",
                "Opportunities",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-2 text-[11px] font-medium ${
                    index === 0
                      ? "bg-white/10 text-white"
                      : "text-slate-400"
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
                  Business overview
                </p>

                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  Your commerce, connected.
                </h3>
              </div>

              <div className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-500 sm:block">
                Last 30 days
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Revenue", "€84,240", "+18.4%"],
                ["Orders", "1,284", "+12.8%"],
                ["Customers", "8,492", "+9.2%"],
                ["Opportunities", "146", "+24.5%"],
              ].map(([label, value, change]) => (
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
                      Revenue overview
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Performance across your stores
                    </p>
                  </div>

                  <TrendingUp size={17} className="text-emerald-500" />
                </div>

                <div className="mt-8 flex h-32 items-end gap-2">
                  {[34, 42, 38, 55, 48, 64, 59, 76, 69, 83, 78, 94].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-emerald-100"
                        style={{ height: `${height}%` }}
                      >
                        <div
                          className="h-full rounded-t-md bg-emerald-500"
                          style={{
                            height: `${Math.max(35, height - 18)}%`,
                          }}
                        />
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-3 flex justify-between text-[9px] text-slate-400">
                  <span>May 1</span>
                  <span>May 30</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-950">
                    Customer segments
                  </p>

                  <Users size={16} className="text-slate-400" />
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    ["High value", "2,184", "74%"],
                    ["Returning", "3,492", "58%"],
                    ["At risk", "816", "31%"],
                  ].map(([label, value, width]) => (
                    <div key={label}>
                      <div className="flex justify-between text-[10px]">
                        <span className="font-medium text-slate-600">
                          {label}
                        </span>

                        <span className="font-semibold text-slate-900">
                          {value}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500"
                          style={{ width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Layers3 size={19} strokeWidth={2.2} />
            </div>

            <span className="text-lg font-bold tracking-tight">Revora</span>
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
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Fonctionnalités
            </Link>

            <Link
              to="/how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Comment sa marche
            </Link>

            <Link
              to="/pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Tarifs
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Commencez
              <ArrowRight size={15} />
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg p-2 text-slate-700 md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
            <nav className="flex flex-col gap-4">
              {[
                ["/product", "Product"],
                ["/features", "Features"],
                ["/how-it-works", "How it works"],
                ["/pricing", "Pricing"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-slate-700"
                >
                  {label}
                </Link>
              ))}

              <div className="mt-2 flex flex-col gap-3 border-t border-slate-200 pt-4">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-slate-700"
                >
                  Se connecter
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  S'enregistrer
                  <ArrowRight size={15} />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 lg:pt-40">
          <div className="absolute inset-x-0 top-0 -z-10 h-[650px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_48%)]" />

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
                <Sparkles size={13} />
                Commerce Intelligence
              </div>

              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
                Une seule vue pour piloter votre{" "}
                <span className="text-emerald-600">
                  activité e-commerce.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Connectez vos stores, customers, products et orders.
                Comprenez ce qui se passe dans votre activité et identifiez
                les opportunités qui méritent votre attention.
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
                  to="/product"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
                >
                  Découvrir Revora
                  <ChevronRight size={16} />
                </Link>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Pensé pour les équipes e-commerce en croissance.
              </p>
            </div>

            <div className="mt-20 lg:mt-24">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="border-y border-slate-200 bg-slate-50/70 py-8">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 sm:gap-x-12">
              {signals.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-emerald-600">
                  Le problème
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Votre activité génère beaucoup de données. Les exploiter
                  reste souvent compliqué.
                </h2>
              </div>

              <div>
                <p className="text-lg leading-8 text-slate-600">
                  Plusieurs stores, des exports, des dashboards différents,
                  des données clients dispersées et des opportunités difficiles
                  à identifier. La croissance ajoute de la complexité alors
                  qu'elle devrait surtout ajouter de la visibilité.
                </p>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Revora crée une couche commune au-dessus de ces données pour
                  vous donner une vue plus cohérente de votre commerce.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core value */}
        <section className="border-y border-slate-200 bg-slate-950 py-24 text-white lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-emerald-400">
                La proposition Revora
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Connecter les données pour mieux comprendre le commerce.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-400">
                Revora ne cherche pas à ajouter un dashboard de plus. Le
                produit relie les objets fondamentaux de votre activité pour
                créer davantage de contexte autour de chaque décision.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-7"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold">
                      {benefit.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {benefit.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product preview */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-sm font-semibold text-emerald-600">
                  Le produit
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Votre commerce, vu comme un seul système.
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-600">
                  Stores, customers, products, orders, segments et
                  opportunities sont reliés dans le même environnement.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Centralisez vos données commerciales.",
                    "Comprenez les relations entre vos clients et vos ventes.",
                    "Passez des données aux opportunités.",
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

                <Link
                  to="/product"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  Explorer le produit
                  <ArrowRight size={16} />
                </Link>
              </div>

              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* How it works teaser */}
        <section className="border-y border-slate-200 bg-slate-50 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-emerald-600">
                Simple à comprendre
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                De vos données à vos prochaines actions.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Revora structure progressivement votre commerce pour que les
                informations importantes deviennent plus faciles à exploiter.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
              {[
                [
                  "01",
                  "Connecter",
                  "Rassemblez vos stores et vos données commerciales.",
                ],
                [
                  "02",
                  "Comprendre",
                  "Analysez customers, orders, products et segments.",
                ],
                [
                  "03",
                  "Agir",
                  "Identifiez les opportunities qui méritent votre attention.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-7"
                >
                  <span className="text-xs font-bold tracking-widest text-emerald-600">
                    {number}
                  </span>

                  <h3 className="mt-5 text-lg font-semibold text-slate-950">
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
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Voir comment ça marche
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Conversion CTA */}
        <section className="px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 text-center shadow-xl shadow-emerald-600/20 sm:px-12 lg:px-20 lg:py-20">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Donnez enfin une vue claire à votre activité e-commerce.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-emerald-50">
              Commencez avec vos stores et construisez progressivement une
              vision connectée de vos clients, commandes et opportunités.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50"
              >
                Commencer gratuitement
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-400 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Voir les tarifs
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Layers3 size={16} />
              </div>

              <span className="font-bold tracking-tight">Revora</span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Commerce Intelligence pour les entreprises e-commerce.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-medium text-slate-500">
            <Link to="/product" className="hover:text-slate-950">
              Product
            </Link>

            <Link to="/features" className="hover:text-slate-950">
              Features
            </Link>

            <Link to="/how-it-works" className="hover:text-slate-950">
              How it works
            </Link>

            <Link to="/pricing" className="hover:text-slate-950">
              Pricing
            </Link>

            <Link to="/login" className="hover:text-slate-950">
              Sign in
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Revora
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;