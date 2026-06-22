"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { VendorDashboard } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";
import {
  IndianRupee,
  Package,
  ShoppingBag,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function VendorDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<VendorDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== "VENDOR") {
      router.push("/login");
      return;
    }
    api
      .get("/vendor/dashboard")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-12">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        Couldn&apos;t load dashboard.
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
    SUSPENDED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {data.shopName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                statusColors[data.vendorStatus]
              }`}
            >
              {data.vendorStatus}
            </span>
            <span className="text-xs text-gray-500">
              {data.plan} plan
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/vendor/products"
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Manage Products
          </Link>
          <Link
            href="/vendor/orders"
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            View Orders
          </Link>
          <Link
            href="/vendor/subscription"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>

      {data.vendorStatus === "PENDING" && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4 mb-6">
          Your shop is pending admin approval. You can add products, but they
          won&apos;t be visible to buyers until your shop is approved.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="Total Earnings"
          value={`₹${data.totalEarnings.toFixed(0)}`}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="This Month"
          value={`₹${data.thisMonthEarnings.toFixed(0)}`}
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="Total Products"
          value={String(data.totalProducts)}
        />
        <StatCard
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Total Orders"
          value={String(data.totalOrders)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((o) => (
                <div
                  key={o.orderNumber}
                  className="flex justify-between items-center text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {o.orderNumber}
                    </p>
                    <p className="text-gray-500">{o.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{o.amount.toFixed(0)}
                    </p>
                    <p className="text-gray-500 text-xs">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Products</h3>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No sales yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((p) => (
                <div
                  key={p.productName}
                  className="flex justify-between items-center text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <p className="font-medium text-gray-900">
                    {p.productName}
                  </p>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{p.revenue.toFixed(0)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {p.totalSold} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-indigo-600 mb-2">{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}