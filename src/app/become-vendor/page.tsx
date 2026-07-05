"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    commission: "5% commission",
    features: ["Up to 10 products", "Basic support", "Standard listing"],
  },
  {
    name: "Basic",
    price: "₹999/mo",
    commission: "3% commission",
    features: [
      "Unlimited products",
      "Priority support",
      "Standard listing",
    ],
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹2999/mo",
    commission: "1.5% commission",
    features: [
      "Unlimited products",
      "Dedicated support",
      "Featured listings",
      "Advanced analytics",
    ],
  },
];

export default function BecomeVendorPage() {
  return (
    <div>
      <section className="bg-gray-900 text-white text-center py-16 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Open your store on Shopzuu and reach millions of buyers
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Reach buyers across India with low commission, fast payouts, and
          zero hidden fees. Start free, upgrade when you grow.
        </p>
        <Link
          href="/register"
          className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 inline-block"
        >
          Get Started
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Choose your plan
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-indigo-600 shadow-lg scale-105"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {plan.price}
              </p>
              <p className="text-indigo-600 font-medium text-sm mt-1">
                {plan.commission}
              </p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-6 block text-center py-2.5 rounded-lg font-semibold ${
                  plan.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Start with {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}