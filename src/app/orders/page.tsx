"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";

const statusStyles: Record<
  string,
  {
    label: string;
    badge: string;
    icon: React.ReactNode;
  }
> = {
  PENDING: {
    label: "Pending",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },

  CONFIRMED: {
    label: "Confirmed",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },

  SHIPPED: {
    label: "Shipped",
    badge:
      "border-violet-200 bg-violet-50 text-violet-700",
    icon: <Truck className="h-3.5 w-3.5" />,
  },

  DELIVERED: {
    label: "Delivered",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: <PackageCheck className="h-3.5 w-3.5" />,
  },

  CANCELLED: {
    label: "Cancelled",
    badge:
      "border-red-200 bg-red-50 text-red-700",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },

  REFUNDED: {
    label: "Refunded",
    badge:
      "border-gray-200 bg-gray-100 text-gray-700",
    icon: <RotateCcw className="h-3.5 w-3.5" />,
  },
};

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const res = await api.get("/orders/my-orders");

      setOrders(
        Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />

        <div className="absolute -right-28 -top-32 h-80 w-80 rounded-full bg-violet-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />

                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                  Your purchases
                </p>
              </div>

              <h1 className="text-4xl font-black tracking-[-0.04em] text-gray-950 sm:text-5xl">
                My orders
              </h1>

              <p className="mt-3 max-w-xl text-gray-500">
                View your purchases, check delivery
                progress, and track packages from one place.
              </p>
            </div>

            {!loading && orders.length > 0 && (
              <button
                onClick={() => fetchOrders(true)}
                disabled={refreshing}
                className="flex h-11 items-center justify-center gap-2 self-start rounded-full border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md disabled:opacity-60 sm:self-auto"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}

                Refresh
              </button>
            )}
          </div>

          {!loading && orders.length > 0 && (
            <div className="mt-9 flex flex-wrap gap-3">
              <SummaryPill
                icon={<ShoppingBag className="h-4 w-4" />}
                text={`${orders.length} ${
                  orders.length === 1
                    ? "order"
                    : "orders"
                }`}
              />

              <SummaryPill
                icon={<Truck className="h-4 w-4" />}
                text={`${
                  orders.filter(
                    (order) =>
                      order.status === "SHIPPED"
                  ).length
                } in transit`}
              />

              <SummaryPill
                icon={
                  <PackageCheck className="h-4 w-4" />
                }
                text={`${
                  orders.filter(
                    (order) =>
                      order.status === "DELIVERED"
                  ).length
                } delivered`}
              />
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <OrdersSkeleton />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => fetchOrders()}
          />
        ) : orders.length === 0 ? (
          <EmptyOrders
            onShop={() => router.push("/products")}
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status =
                statusStyles[order.status] ||
                statusStyles.PENDING;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
                >
                  {/* ORDER HEADER */}
                  <div className="flex flex-col gap-5 border-b border-gray-100 bg-gray-50/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-white shadow-lg">
                        <ReceiptText className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Order number
                        </p>

                        <h2 className="mt-1 font-black text-gray-950">
                          {order.orderNumber}
                        </h2>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5" />

                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold ${status.badge}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          Order total
                        </p>

                        <p className="mt-0.5 text-xl font-black text-gray-950">
                          ₹{order.totalAmount.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ORDER ITEMS */}
                  <div className="px-5 py-2 sm:px-7">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        className="flex items-center gap-4 border-b border-gray-100 py-5 last:border-b-0"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                          <Package className="h-6 w-6 text-gray-300" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 font-bold text-gray-900">
                            {item.productName}
                          </h3>

                          <p className="mt-1.5 text-xs font-semibold text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 font-black text-gray-950">
                          ₹{item.subtotal.toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* SHIPMENT DETAILS */}
                  {(order.status === "SHIPPED" ||
                    order.status === "DELIVERED") &&
                    order.courierName &&
                    order.trackingNumber && (
                      <div className="mx-5 mb-5 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 sm:mx-7">
                        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                              <Truck className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-500">
                                Shipment details
                              </p>

                              <p className="mt-1.5 font-extrabold text-gray-950">
                                {order.courierName}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                Tracking:{" "}
                                <span className="font-bold text-gray-700">
                                  {order.trackingNumber}
                                </span>
                              </p>

                              {order.shippedAt && (
                                <p className="mt-1 text-xs text-gray-400">
                                  Shipped{" "}
                                  {new Date(
                                    order.shippedAt
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>

                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
                            >
                              Track package

                              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                  {/* ORDER FOOTER */}
                  <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {order.status === "DELIVERED" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          Order successfully delivered
                        </>
                      ) : order.status === "CANCELLED" ? (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          This order was cancelled
                        </>
                      ) : (
                        <>
                          <PackageCheck className="h-4 w-4 text-indigo-500" />
                          We&apos;ll keep you updated
                        </>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/orders/${order.id}`)
                      }
                      className="group flex items-center gap-2 self-start text-sm font-extrabold text-indigo-600 transition-colors hover:text-indigo-700 sm:self-auto"
                    >
                      View order details

                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryPill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 shadow-sm">
      <span className="text-indigo-600">
        {icon}
      </span>

      {text}
    </div>
  );
}

function EmptyOrders({
  onShop,
}: {
  onShop: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white px-6 py-20 text-center shadow-[0_15px_50px_rgba(15,23,42,0.05)]">
      <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-100/70 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-gray-950 text-white shadow-xl">
          <ShoppingBag className="h-8 w-8" />
        </div>

        <h2 className="mt-7 text-2xl font-black tracking-tight text-gray-950">
          No orders yet
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          Your future purchases will appear here with
          delivery updates and tracking details.
        </p>

        <button
          onClick={onShop}
          className="group mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-indigo-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          Explore products

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-red-100 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <XCircle className="h-6 w-6" />
      </div>

      <h2 className="mt-5 font-black text-gray-950">
        Couldn&apos;t load your orders
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-bold text-white"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[28px] border border-gray-200 bg-white"
        >
          <div className="flex items-center justify-between bg-gray-50 p-6">
            <div>
              <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-3 w-24 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200" />
          </div>

          <div className="p-6">
            <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
            <div className="mt-4 h-16 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}