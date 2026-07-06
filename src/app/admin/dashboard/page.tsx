"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { AdminDashboard } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";
import {
  ArrowRight,
  BarChart3,
  Building2,
  IndianRupee,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getAuthUser();

    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    fetchDashboard();
  }, []);

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const res = await api.get("/admin/dashboard");
      setData(res.data.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <BarChart3 className="h-6 w-6" />
          </div>

          <h1 className="mt-5 text-xl font-black text-gray-950">
            Couldn&apos;t load dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Something went wrong while loading platform data."}
          </p>

          <button
            onClick={() => fetchDashboard()}
            className="mt-6 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      {/* HEADER */}
      <section className="relative overflow-hidden bg-[#0b1020] text-white">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-indigo-600/25 blur-[110px]" />
        <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-indigo-200 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-pink-400" />
                Shopzuu Control Center
              </div>

              <h1 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Monitor revenue, marketplace growth, vendors, buyers,
                orders, and platform performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => fetchDashboard(true)}
                disabled={refreshing}
                className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/10 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />

                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <Link
                href="/admin/vendors"
                className="group flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-gray-950 transition hover:-translate-y-0.5"
              >
                Manage Vendors

                {data.pendingVendors > 0 && (
                  <span className="flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                    {data.pendingVendors}
                  </span>
                )}

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* REVENUE OVERVIEW */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
              Financial Overview
            </p>

            <h2 className="mt-2 text-xl font-black text-gray-950">
              Platform Revenue
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<IndianRupee className="h-5 w-5" />}
              label="Total Revenue"
              value={`₹${data.totalPlatformRevenue.toFixed(2)}`}
              description="All-time platform earnings"
              highlight
            />

            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="This Month"
              value={`₹${data.thisMonthRevenue.toFixed(2)}`}
              description="Revenue earned this month"
            />

            <StatCard
              icon={<Building2 className="h-5 w-5" />}
              label="Subscription Revenue"
              value={`₹${data.subscriptionRevenue.toFixed(2)}`}
              description="Revenue from vendor plans"
            />

            <StatCard
              icon={<BarChart3 className="h-5 w-5" />}
              label="Commission Revenue"
              value={`₹${data.commissionRevenue.toFixed(2)}`}
              description="Revenue from marketplace sales"
            />
          </div>
        </section>

        {/* MARKETPLACE OVERVIEW */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-pink-600">
              Marketplace Overview
            </p>

            <h2 className="mt-2 text-xl font-black text-gray-950">
              Platform Activity
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard
              icon={<Store className="h-5 w-5" />}
              label="Active Vendors"
              value={String(data.activeVendors)}
              description="Approved marketplace sellers"
            />

            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Total Buyers"
              value={String(data.totalBuyers)}
              description="Registered customers"
            />

            <StatCard
              icon={<ShoppingBag className="h-5 w-5" />}
              label="Total Orders"
              value={String(data.totalOrders)}
              description="Orders across Shopzuu"
            />

            <StatCard
              icon={<Package className="h-5 w-5" />}
              label="GMV"
              value={`₹${data.totalGMV.toFixed(2)}`}
              description="Total marketplace sales value"
            />
          </div>
        </section>

        {/* TOP VENDORS */}
        <section className="mt-10 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600">
                Seller Performance
              </p>

              <h2 className="mt-2 text-xl font-black text-gray-950">
                Top Vendors
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Leading sellers based on marketplace activity.
              </p>
            </div>

            <Link
              href="/admin/vendors"
              className="group flex items-center gap-2 text-sm font-bold text-indigo-600"
            >
              View all vendors
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {data.topVendors.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Store className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                No vendor activity yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Vendor performance will appear here after sales begin.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Total Sales</th>
                    <th className="px-6 py-4">
                      Commission Paid
                    </th>
                    <th className="px-6 py-4">Orders</th>
                  </tr>
                </thead>

                <tbody>
                  {data.topVendors.map((vendor, index) => (
                    <tr
                      key={`${vendor.shopName}-${index}`}
                      className="border-t border-gray-100 transition hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-xs font-black text-white">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <span className="font-bold text-gray-950">
                            {vendor.shopName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <PlanBadge plan={vendor.plan} />
                      </td>

                      <td className="px-6 py-5 font-semibold text-gray-900">
                        ₹{vendor.totalSales.toFixed(2)}
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        ₹{vendor.commissionPaid.toFixed(2)}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                          {vendor.totalOrders}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
        highlight
          ? "border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-100"
          : "border-gray-200 bg-white"
      }`}
    >
      {highlight && (
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      )}

      <div
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${
          highlight
            ? "bg-white/15 text-white"
            : "bg-indigo-50 text-indigo-600"
        }`}
      >
        {icon}
      </div>

      <p
        className={`relative mt-5 text-xs font-bold ${
          highlight ? "text-indigo-100" : "text-gray-500"
        }`}
      >
        {label}
      </p>

      <p className="relative mt-1 break-words text-xl font-black tracking-tight sm:text-2xl">
        {value}
      </p>

      <p
        className={`relative mt-2 text-xs leading-5 ${
          highlight ? "text-indigo-200" : "text-gray-400"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-700",
    BASIC: "bg-indigo-50 text-indigo-700",
    PRO: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${
        styles[plan] || "bg-gray-100 text-gray-700"
      }`}
    >
      {plan}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f7f8fc]">
      <div className="h-64 bg-[#0b1020]" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-[24px] bg-gray-200"
            />
          ))}
        </div>

        <div className="mt-10 h-80 rounded-[28px] bg-gray-200" />
      </div>
    </main>
  );
}