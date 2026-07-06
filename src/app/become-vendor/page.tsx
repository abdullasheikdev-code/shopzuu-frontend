"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  IndianRupee,
  Package,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    commission: "5% commission",
    description: "Perfect for starting your online journey.",
    features: [
      "Up to 10 products",
      "Basic support",
      "Standard listing",
    ],
  },
  {
    name: "Basic",
    price: "₹999",
    period: "/ month",
    commission: "3% commission",
    description: "Built for sellers ready to grow faster.",
    features: [
      "Unlimited products",
      "Priority support",
      "Standard listing",
    ],
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹2999",
    period: "/ month",
    commission: "1.5% commission",
    description: "Advanced tools for ambitious businesses.",
    features: [
      "Unlimited products",
      "Dedicated support",
      "Featured listings",
      "Advanced analytics",
    ],
  },
];

const benefits = [
  {
    icon: <Store className="h-6 w-6" />,
    title: "Your own storefront",
    description:
      "Build your presence and showcase products to customers across the marketplace.",
  },
  {
    icon: <IndianRupee className="h-6 w-6" />,
    title: "Lower commissions",
    description:
      "Keep more of what you earn with simple and transparent seller pricing.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Grow with insights",
    description:
      "Understand your products, orders, and business performance as you grow.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Secure selling",
    description:
      "Manage your store and orders through a marketplace built around trust.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your seller account",
    description:
      "Register on Shopzuu and tell us a little about your business.",
  },
  {
    number: "02",
    title: "Get your shop approved",
    description:
      "Your seller profile is reviewed before your storefront goes live.",
  },
  {
    number: "03",
    title: "List your products",
    description:
      "Add your products, prices, stock, images, and descriptions.",
  },
  {
    number: "04",
    title: "Start receiving orders",
    description:
      "Manage orders and grow your business from your seller dashboard.",
  },
];

export default function BecomeVendorPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0b1020] text-white">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[140px]" />
        <div className="absolute -right-40 top-0 h-[550px] w-[550px] rounded-full bg-violet-600/20 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          {/* LEFT */}
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-indigo-200 backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              Built for ambitious sellers
            </div>

            <h1 className="text-5xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-[72px]">
              Turn your products
              <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                into a growing business.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
              Open your Shopzuu store, reach customers across India,
              manage orders, and grow with simple pricing and powerful
              seller tools.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/register"
                className="group flex h-14 items-center gap-2 rounded-full bg-white px-7 text-sm font-extrabold text-gray-950 shadow-[0_15px_40px_rgba(255,255,255,0.14)] transition-all duration-300 hover:-translate-y-1"
              >
                Start Selling Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#plans"
                className="flex h-14 items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-7 text-sm font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10"
              >
                View Plans
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400 lg:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Start for ₹0
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No hidden fees
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Upgrade anytime
              </span>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative mx-auto hidden w-full max-w-[500px] lg:block">
            <div className="absolute -inset-10 rounded-full bg-indigo-500/15 blur-3xl" />

            <div className="relative rotate-2 rounded-[36px] border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[28px] border border-white/10 bg-[#11172a]/90 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-300">
                      Seller Dashboard
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      Your business, growing
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-4">
                  <SellerStat
                    icon={<WalletCards className="h-5 w-5" />}
                    label="Revenue"
                    value="Track sales"
                  />

                  <SellerStat
                    icon={<Package className="h-5 w-5" />}
                    label="Products"
                    value="Manage stock"
                  />

                  <SellerStat
                    icon={<Users className="h-5 w-5" />}
                    label="Customers"
                    value="Reach buyers"
                  />

                  <SellerStat
                    icon={<BarChart3 className="h-5 w-5" />}
                    label="Analytics"
                    value="See growth"
                  />
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">
                        Ready to start?
                      </p>
                      <p className="mt-1 font-extrabold">
                        Create your store today
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-950">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="relative border-t border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <TrustItem
              icon={<Zap className="h-5 w-5" />}
              title="Quick setup"
              description="Create your store easily"
            />

            <TrustItem
              icon={<BadgePercent className="h-5 w-5" />}
              title="Simple pricing"
              description="Clear commissions"
            />

            <TrustItem
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Seller support"
              description="Grow with confidence"
            />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#fafafa] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
              Why sell on Shopzuu?
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-5xl">
              Everything you need to start growing
            </h2>

            <p className="mt-5 leading-7 text-gray-500">
              Focus on your products while Shopzuu gives you the tools
              to build and manage your online business.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                  {benefit.icon}
                </div>

                <h3 className="mt-6 text-lg font-black text-gray-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
              Simple from day one
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-5xl">
              Start selling in four steps
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-white p-6"
              >
                <span className="text-5xl font-black tracking-[-0.06em] text-gray-100">
                  {step.number}
                </span>

                <h3 className="mt-8 font-black text-gray-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="plans"
        className="bg-[#f7f7fb] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
              Seller plans
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-5xl">
              Start free. Upgrade as you grow.
            </h2>

            <p className="mt-5 text-gray-500">
              Choose the plan that fits your business today.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[32px] p-7 transition-all duration-300 ${
                  plan.highlight
                    ? "bg-[#0b1020] text-white shadow-2xl lg:-translate-y-4"
                    : "border border-gray-200 bg-white text-gray-950 shadow-sm hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-black">
                    {plan.name}
                  </h3>

                  <p
                    className={`mt-2 text-sm ${
                      plan.highlight
                        ? "text-slate-400"
                        : "text-gray-500"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-4xl font-black tracking-tight">
                    {plan.price}
                  </span>

                  <span
                    className={`pb-1 text-sm ${
                      plan.highlight
                        ? "text-slate-400"
                        : "text-gray-500"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <div
                  className={`mt-4 inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-extrabold ${
                    plan.highlight
                      ? "bg-indigo-500/15 text-indigo-300"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {plan.commission}
                </div>

                <div
                  className={`my-7 h-px ${
                    plan.highlight
                      ? "bg-white/10"
                      : "bg-gray-200"
                  }`}
                />

                <ul className="flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-3 text-sm font-medium ${
                        plan.highlight
                          ? "text-slate-300"
                          : "text-gray-600"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          plan.highlight
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>

                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`group mt-8 flex h-13 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-extrabold transition-all ${
                    plan.highlight
                      ? "bg-white text-gray-950 hover:bg-indigo-50"
                      : "bg-gray-950 text-white hover:bg-indigo-600"
                  }`}
                >
                  Start with {plan.name}

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#101525] px-6 py-14 text-white shadow-2xl sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-[100px]" />
          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-[100px]" />

          <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-300">
                Your next chapter starts here
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                Ready to build your store?
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                Create your seller account and start building your
                business on Shopzuu.
              </p>
            </div>

            <Link
              href="/register"
              className="group flex h-14 shrink-0 items-center gap-2 rounded-full bg-white px-7 text-sm font-extrabold text-gray-950 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Start Selling Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SellerStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
        {icon}
      </div>

      <p className="mt-5 text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-extrabold text-white">
        {value}
      </p>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 px-6 py-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-indigo-300">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-white">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}