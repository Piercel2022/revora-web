import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Database,
  Layers3,
  Menu,
  Package,
  ShoppingCart,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Store,
    title: "Connect every store",
    description:
      "Bring your ecommerce stores into one operational workspace and keep your business data centralized.",
  },
  {
    icon: Users,
    title: "Know your customers",
    description:
      "Turn customer activity into useful segments, opportunities and actionable commercial insights.",
  },
  {
    icon: Package,
    title: "Manage your catalog",
    description:
      "Keep products and commercial data organized across your stores without switching between tools.",
  },
  {
    icon: ShoppingCart,
    title: "Follow every order",
    description:
      "Get a clearer view of orders, revenue and customer activity from one unified workspace.",
  },
  {
    icon: Target,
    title: "Find opportunities",
    description:
      "Identify valuable customer segments and opportunities before they disappear.",
  },
  {
    icon: BarChart3,
    title: "Make better decisions",
    description:
      "Turn fragmented ecommerce data into a simple view of what is happening in your business.",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect your stores",
    description:
      "Bring your ecommerce data into Revora and create a single source of truth.",
  },
  {
    number: "02",
    title: "Understand your customers",
    description:
      "Organize customers, orders and products into a clear commercial picture.",
  },
  {
    number: "03",
    title: "Act on opportunities",
    description:
      "Use segments, opportunities and insights to focus your next commercial actions.",
  },
];

function Homepage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Layers3 size={19} strokeWidth={2.2} />
            </div>

            <span className="text-lg font-bold tracking-tight">Revora</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#product"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Product
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              How it works
            </a>
            <a
              href="/pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Pricing
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
            >
              Sign in
            </a>

            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Get started
              <ArrowRight size={15} />
            </a>
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
              <a
                href="#product"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                Product
              </a>
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                How it works
              </a>
              <a
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                Pricing
              </a>

              <div className="mt-2 flex flex-col gap-3 border-t border-slate-200 pt-4">
                <a
                  href="/login"
                  className="text-sm font-semibold text-slate-700"
                >
                  Sign in
                </a>

                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  Get started
                  <ArrowRight size={15} />
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden pt-32 lg:pt-40">
          <div className="absolute inset-x-0 top-0 -z-10 h-160 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_48%)]" />

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
                <Sparkles size={13} />
                Ecommerce operations, simplified
              </div>

              <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
                Run your ecommerce business from{" "}
                <span className="text-emerald-600">one place.</span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Revora brings stores, customers, products, orders and
                opportunities together so you can understand your business
                and act faster.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
                >
                  Start for free
                  <ArrowRight size={16} />
                </a>

                <a
                  href="#product"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
                >
                  Explore Revora
                  <ChevronRight size={16} />
                </a>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                No credit card required · Built for growing ecommerce teams
              </p>
            </div>

            <div
              id="product"
              className="relative mx-auto mt-20 max-w-6xl lg:mt-24"
            >
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-emerald-500/10 blur-3xl" />

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

                <div className="grid min-h-105 lg:grid-cols-[190px_1fr]">
                  <aside className="hidden border-r border-slate-200 bg-slate-950 p-4 lg:block">
                    <div className="mb-8 flex items-center gap-2 text-white">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
                        <Layers3 size={14} />
                      </div>
                      <span className="text-sm font-bold">Revora</span>
                    </div>

                    <div className="space-y-1">
                      {[
                        "Overview",
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
                          Overview
                        </p>
                        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                          Good morning, welcome back.
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

                          <TrendingUp
                            size={17}
                            className="text-emerald-500"
                          />
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
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50/70 py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <span>Shopify</span>
            <span>WooCommerce</span>
            <span>Stripe</span>
            <span>Amazon</span>
            <span>Google Analytics</span>
          </div>
        </section>

        <section id="features" className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-600">
                Everything connected
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                One workspace for the entire customer journey.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Stop stitching together spreadsheets, dashboards and isolated
                tools. Revora gives your team one operational layer for
                understanding and growing your ecommerce business.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="bg-white p-7 transition hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-6 text-base font-semibold text-slate-950">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-slate-950 py-24 text-white lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold text-emerald-400">
                  How it works
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  From fragmented data to clear action.
                </h2>

                <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
                  Revora is designed to reduce operational complexity without
                  adding another layer of complexity to your team.
                </p>

                <a
                  href="/register"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Start building your workspace
                  <ArrowRight size={15} />
                </a>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="grid gap-4 py-8 sm:grid-cols-[70px_1fr]"
                  >
                    <span className="text-sm font-semibold text-emerald-400">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Database size={22} />
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Built to grow with your business.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Start with the essentials and expand your Revora workspace as
              your stores, customers and team grow.
            </p>

            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Revora
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Everything you need to get started.
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  Flexible
                </span>
              </div>

              <div className="mt-7 space-y-3">
                {[
                  "Centralized store data",
                  "Customer management",
                  "Product & order management",
                  "Segments & opportunities",
                  "Business insights",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <Check size={15} className="text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>

              <a
                href="/register"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Get started
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 text-center sm:px-12 lg:px-20">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your ecommerce data is already valuable. Make it useful.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-emerald-50">
              Bring your operations together and give your team a clearer way
              to understand customers, orders and growth opportunities.
            </p>

            <a
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50"
            >
              Start with Revora
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>

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
              Ecommerce operations, simplified.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-medium text-slate-500">
            <a href="#product" className="hover:text-slate-950">
              Product
            </a>
            <a href="#features" className="hover:text-slate-950">
              Features
            </a>
            <a href="/pricing" className="hover:text-slate-950">
              Pricing
            </a>
            <a href="/login" className="hover:text-slate-950">
              Sign in
            </a>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Revora
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;