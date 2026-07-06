"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { VendorDashboard } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  TriangleAlert,
  Users,
  WalletCards,
} from "lucide-react";

export default function VendorDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<VendorDashboard | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getAuthUser();

    if (!user || user.role !== "VENDOR") {
      router.push("/login");
      return;
    }

    api
      .get("/vendor/dashboard")
      .then((res) => {
        setData(res.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f7f7fb] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-sm">
            <TriangleAlert className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              Couldn&apos;t load dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const statusStyles: Record<string, string> = {
    APPROVED:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",
    REJECTED:
      "border-red-200 bg-red-50 text-red-700",
    SUSPENDED:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <main className="min-h-screen bg-[#f7f7fb] pb-20">
      {/* HEADER */}
      <section className="relative overflow-hidden bg-[#0b1020] text-white">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-indigo-600/30 blur-[120px]" />

        <div className="absolute -right-32 -top-24 h-[450px] w-[450px] rounded-full bg-violet-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          {/* TOP BAR */}
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold ${
                    statusStyles[data.vendorStatus] ||
                    "border-white/10 bg-white/10 text-white"
                  }`}
                >
                  {data.vendorStatus === "APPROVED" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Clock3 className="h-3.5 w-3.5" />
                  )}

                  {data.vendorStatus}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-indigo-200">
                  {data.plan} plan
                </span>
              </div>

              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-300">
                Seller Dashboard
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
                {data.shopName}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Track your store performance, manage products,
                and stay on top of your latest orders.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/vendor/products"
                className="group flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-bold text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <Package className="h-4 w-4" />
                Products
              </Link>

              <Link
                href="/vendor/orders"
                className="group flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-bold text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <ShoppingBag className="h-4 w-4" />
                Orders
              </Link>

              <Link
                href="/vendor/subscription"
                className="group flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-gray-950 shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Upgrade Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="relative mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* PENDING NOTICE */}
        {data.vendorStatus === "PENDING" && (
          <div className="mb-6 flex items-start gap-4 rounded-[24px] border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-amber-950">
                Your shop is awaiting approval
              </h3>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                You can add products now, but they won&apos;t be
                visible to buyers until an admin approves your shop.
              </p>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<IndianRupee className="h-5 w-5" />}
            label="Total Earnings"
            value={`₹${data.totalEarnings.toFixed(2)}`}
            description="Lifetime revenue"
          />

          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="This Month"
            value={`₹${data.thisMonthEarnings.toFixed(2)}`}
            description="Current month revenue"
          />

          <StatCard
            icon={<Package className="h-5 w-5" />}
            label="Total Products"
            value={String(data.totalProducts)}
            description="Products in your store"
          />

          <StatCard
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Total Orders"
            value={String(data.totalOrders)}
            description="Orders received"
          />
        </div>

        {/* QUICK ACTIONS */}
        <section className="mt-6 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
              Quick actions
            </p>

            <h2 className="mt-2 text-xl font-black text-gray-950">
              Manage your business
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <QuickAction
              href="/vendor/products"
              icon={<Package className="h-5 w-5" />}
              title="Manage Products"
              description="Add, edit and manage inventory"
            />

            <QuickAction
              href="/vendor/orders"
              icon={<ShoppingBag className="h-5 w-5" />}
              title="View Orders"
              description="Process your latest customer orders"
            />

            <QuickAction
              href="/vendor/subscription"
              icon={<Sparkles className="h-5 w-5" />}
              title="Upgrade Plan"
              description="Unlock more seller features"
            />
          </div>
        </section>

        {/* ORDERS + PRODUCTS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* RECENT ORDERS */}
          <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
                  Latest activity
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Recent Orders
                </h2>
              </div>

              <Link
                href="/vendor/orders"
                className="group flex items-center gap-1 text-sm font-extrabold text-indigo-600"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {data.recentOrders.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag className="h-6 w-6" />}
                title="No orders yet"
                description="Your latest customer orders will appear here."
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {data.recentOrders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <ShoppingBag className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-gray-950">
                          {order.orderNumber}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <Users className="h-3.5 w-3.5" />
                          <span className="truncate">
                            {order.buyerName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-gray-950">
                        ₹{order.amount.toFixed(2)}
                      </p>

                      <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-gray-600">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* TOP PRODUCTS */}
          <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600">
                  Best performers
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Top Products
                </h2>
              </div>

              <Link
                href="/vendor/products"
                className="group flex items-center gap-1 text-sm font-extrabold text-indigo-600"
              >
                Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {data.topProducts.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="h-6 w-6" />}
                title="No sales yet"
                description="Your best-performing products will appear here."
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {data.topProducts.map((product, index) => (
                  <div
                    key={product.productName}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-sm font-black text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-gray-950">
                          {product.productName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {product.totalSold} sold
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-gray-950">
                        ₹{product.revenue.toFixed(2)}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Revenue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* BUSINESS SUMMARY */}
        <section className="relative mt-6 overflow-hidden rounded-[32px] bg-[#101525] p-7 text-white shadow-xl sm:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-[90px]" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-300">
                <WalletCards className="h-4 w-4" />
                Business overview
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Keep building your Shopzuu store
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Add quality products, process orders quickly,
                and keep growing your marketplace presence.
              </p>
            </div>

            <Link
              href="/vendor/products"
              className="group flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-gray-950 transition-all hover:-translate-y-0.5"
            >
              Manage Store
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="group rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          {icon}
        </div>

        <TrendingUp className="h-4 w-4 text-gray-300" />
      </div>

      <p className="mt-5 text-xs font-bold text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-xl font-black tracking-tight text-gray-950 sm:text-2xl">
        {value}
      </p>

      <p className="mt-2 hidden text-xs text-gray-400 sm:block">
        {description}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[20px] border border-gray-200 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/40"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-white transition-colors group-hover:bg-indigo-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-extrabold text-gray-950">
          {title}
        </p>

        <p className="mt-1 hidden text-xs text-gray-500 sm:block">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600" />
    </Link>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        {icon}
      </div>

      <h3 className="mt-4 font-extrabold text-gray-950">
        {title}
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      <div className="h-72 animate-pulse bg-[#0b1020]" />

      <div className="relative mx-auto -mt-12 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-[26px] border border-gray-200 bg-white"
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-[28px] bg-white" />
          <div className="h-96 animate-pulse rounded-[28px] bg-white" />
        </div>
      </div>
    </main>
  );
}