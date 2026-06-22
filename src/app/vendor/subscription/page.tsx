"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Check } from "lucide-react";

const plans = [
  { key: "FREE", name: "Free", price: "₹0", commission: "5% commission" },
  { key: "BASIC", name: "Basic", price: "₹999/mo", commission: "3% commission" },
  { key: "PRO", name: "Pro", price: "₹2999/mo", commission: "1.5% commission" },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const subscribe = async (plan: string) => {
    setLoadingPlan(plan);
    setMessage("");
    try {
      const res = await api.post("/vendor/subscription/subscribe", { plan });
      setMessage(res.data.message);
      setTimeout(() => router.push("/vendor/dashboard"), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to subscribe");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Choose Your Plan
      </h1>

      {message && (
        <div className="bg-indigo-50 text-indigo-700 text-sm rounded-lg p-3 mb-6">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className="border border-gray-200 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {plan.price}
            </p>
            <p className="text-indigo-600 text-sm font-medium mt-1">
              {plan.commission}
            </p>
            <button
              onClick={() => subscribe(plan.key)}
              disabled={loadingPlan === plan.key}
              className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60"
            >
              {loadingPlan === plan.key ? "Processing..." : `Switch to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Note: this demo calls the plan-switch endpoint directly. Wire up
        Stripe Checkout on this button before going live so vendors are
        actually billed.
      </p>
    </div>
  );
}