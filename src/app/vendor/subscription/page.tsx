"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  ArrowLeft,
  Check,
  Crown,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const plans = [
  {
    key: "FREE",
    name: "Free",
    price: "₹0",
    period: "forever",
    commission: "5% commission",
    description:
      "Everything you need to start selling and test your business.",
    icon: Rocket,
    features: [
      "Up to 10 products",
      "Standard product listings",
      "Basic seller dashboard",
      "Order management",
      "Basic support",
    ],
  },
  {
    key: "BASIC",
    name: "Basic",
    price: "₹999",
    period: "/ month",
    commission: "3% commission",
    description:
      "Built for growing sellers who want more products and better support.",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited products",
      "Everything in Free",
      "Lower 3% commission",
      "Priority seller support",
      "Advanced order management",
      "Better marketplace visibility",
    ],
  },
  {
    key: "PRO",
    name: "Pro",
    price: "₹2,999",
    period: "/ month",
    commission: "1.5% commission",
    description:
      "Maximum growth tools for established and high-volume sellers.",
    icon: Crown,
    features: [
      "Unlimited products",
      "Everything in Basic",
      "Lowest 1.5% commission",
      "Featured product listings",
      "Advanced analytics",
      "Dedicated seller support",
      "Maximum marketplace visibility",
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const subscribe = async (plan: string) => {
    if (loadingPlan) return;

    setLoadingPlan(plan);
    setMessage("");
    setIsError(false);

    try {
      const res = await api.post(
        "/vendor/subscription/subscribe",
        { plan }
      );

      setMessage(
        res.data.message ||
          "Your subscription plan has been updated successfully."
      );

      setTimeout(() => {
        router.push("/vendor/dashboard");
      }, 1500);
    } catch (err: any) {
      setIsError(true);

      setMessage(
        err.response?.data?.message ||
          "Failed to update your subscription plan."
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0b1020] text-white">
        {/* Background glow */}
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-indigo-600/25 blur-[110px]" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24">
          {/* Back button */}
          <button
            onClick={() => router.push("/vendor/dashboard")}
            className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-200 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-pink-400" />
              Grow your Shopzuu store
            </div>

            <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Choose the plan that
              <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                matches your growth.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Start selling for free and upgrade as your business grows.
              Lower commissions help you keep more from every sale.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24">
        {/* MESSAGE */}
        {message && (
          <div
            className={`mx-auto mb-8 max-w-3xl rounded-2xl border px-5 py-4 text-sm font-medium shadow-sm ${
              isError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isLoading = loadingPlan === plan.key;

            return (
              <div
                key={plan.key}
                className={`relative flex flex-col overflow-hidden rounded-[30px] border bg-white p-6 transition-all duration-300 sm:p-8 ${
                  plan.popular
                    ? "border-indigo-500 shadow-[0_25px_70px_rgba(79,70,229,0.18)] lg:-translate-y-3"
                    : "border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute right-0 top-0 rounded-bl-2xl bg-indigo-600 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-white">
                    Most Popular
                  </div>
                )}

                {/* Plan icon */}
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${
                    plan.popular
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Plan heading */}
                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    {plan.name}
                  </h2>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-7">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black tracking-tight text-gray-950">
                      {plan.price}
                    </span>

                    <span className="mb-1 text-sm font-medium text-gray-400">
                      {plan.period}
                    </span>
                  </div>

                  <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    {plan.commission}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-7 h-px bg-gray-100" />

                {/* Features */}
                <div className="flex-1">
                  <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-gray-400">
                    What&apos;s included
                  </p>

                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            plan.popular
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button
                  onClick={() => subscribe(plan.key)}
                  disabled={loadingPlan !== null}
                  className={`mt-8 flex h-12 w-full items-center justify-center rounded-xl text-sm font-extrabold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                    plan.popular
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-700"
                      : "border border-gray-200 bg-gray-950 text-white hover:-translate-y-0.5 hover:bg-gray-800"
                  }`}
                >
                  {isLoading
                    ? "Processing..."
                    : plan.key === "FREE"
                    ? "Choose Free"
                    : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* TRUST SECTION */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <TrustCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="No hidden charges"
            description="Clear pricing and transparent commission rates."
          />

          <TrustCard
            icon={<Zap className="h-5 w-5" />}
            title="Upgrade as you grow"
            description="Move to a better plan when your business needs it."
          />

          <TrustCard
            icon={<Crown className="h-5 w-5" />}
            title="Keep more earnings"
            description="Higher plans reduce the commission on every sale."
          />
        </div>

        {/* FOOT NOTE */}
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-sm leading-6 text-gray-500">
            Your selected plan controls product limits, seller benefits,
            and the commission charged on successful orders.
          </p>
        </div>
      </section>
    </main>
  );
}

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}