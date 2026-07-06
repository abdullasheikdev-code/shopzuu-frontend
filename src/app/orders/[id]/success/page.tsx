"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Order } from "@/lib/types";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

export default function OrderSuccessPage() {
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get("/orders/my-orders");

        const orders = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        const found = orders.find(
          (o: Order) => String(o.id) === String(id)
        );

        setOrder(found || null);
      } catch (error) {
        console.error("ORDER SUCCESS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f7f7fb] px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-lg">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
          </div>

          <p className="mt-5 text-sm font-semibold text-gray-500">
            Confirming your order...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7fb] px-4 py-12 sm:px-6 sm:py-16">
      {/* Background decorations */}
      <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-[120px]" />

      <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-emerald-200/30 blur-[120px]" />

      <div className="relative mx-auto max-w-2xl">
        {/* SUCCESS CARD */}
        <section className="overflow-hidden rounded-[36px] border border-gray-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          {/* Top success area */}
          <div className="relative overflow-hidden px-6 pb-10 pt-12 text-center sm:px-12">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-100/70 blur-3xl" />

            <div className="relative">
              {/* Success icon */}
              <div className="relative mx-auto h-24 w-24">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200/40" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-200">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Payment successful
              </div>

              <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl">
                Your order is confirmed!
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                Thank you for shopping with Shopzuu. Your
                order has been placed successfully and is now
                being prepared.
              </p>
            </div>
          </div>

          {/* ORDER INFORMATION */}
          {order && (
            <div className="mx-5 rounded-[28px] border border-gray-200 bg-gray-50/80 p-5 sm:mx-8 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-white shadow-lg">
                  <ReceiptText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Order number
                  </p>

                  <p className="mt-1 break-all text-lg font-black text-gray-950">
                    {order.orderNumber}
                  </p>
                </div>

                <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:flex">
                  <Check className="h-5 w-5" />
                </div>
              </div>

              <div className="my-5 h-px bg-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">
                  Amount paid
                </span>

                <span className="text-xl font-black text-gray-950">
                  ₹{order.totalAmount.toFixed(0)}
                </span>
              </div>
            </div>
          )}

          {/* PROGRESS */}
          <div className="px-5 py-9 sm:px-8">
            <p className="mb-6 text-xs font-extrabold uppercase tracking-[0.18em] text-gray-400">
              What happens next?
            </p>

            <div className="space-y-5">
              <ProgressItem
                icon={<PackageCheck className="h-5 w-5" />}
                title="Order confirmed"
                description="Your payment and order have been successfully received."
                active
              />

              <ProgressItem
                icon={<ShoppingBag className="h-5 w-5" />}
                title="Seller prepares your order"
                description="Your items will be packed and prepared for dispatch."
              />

              <ProgressItem
                icon={<Truck className="h-5 w-5" />}
                title="Delivery updates"
                description="Track your shipment from the My Orders page."
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/orders"
                className="group flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-800"
              >
                <PackageCheck className="h-4 w-4" />
                View My Orders
              </Link>

              <Link
                href="/products"
                className="group flex h-13 flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-extrabold text-gray-800 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
              >
                Continue Shopping

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECURITY MESSAGE */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-medium text-gray-400">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Your order and payment details are securely processed
        </div>
      </div>
    </main>
  );
}

function ProgressItem({
  icon,
  title,
  description,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          active
            ? "bg-emerald-100 text-emerald-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {icon}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-gray-900">
            {title}
          </h3>

          {active && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
              Done
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}