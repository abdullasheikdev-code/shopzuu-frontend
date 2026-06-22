"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { AdminDashboard } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";
import { IndianRupee, Store, Users, ShoppingBag, Package } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    api
      .get("/admin/dashboard")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="max-w-6xl mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link
          href="/admin/vendors"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Manage Vendors{" "}
          {data.pendingVendors > 0 && (
            <span className="ml-1 bg-white text-indigo-600 rounded-full px-1.5 text-xs">
              {data.pendingVendors}
            </span>
          )}
        </Link>
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="Total Revenue"
          value={`₹${data.totalPlatformRevenue.toFixed(0)}`}
          highlight
        />
        <StatCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="This Month"
          value={`₹${data.thisMonthRevenue.toFixed(0)}`}
        />
        <StatCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="Subscription Rev."
          value={`₹${data.subscriptionRevenue.toFixed(0)}`}
        />
        <StatCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="Commission Rev."
          value={`₹${data.commissionRevenue.toFixed(0)}`}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Store className="w-5 h-5" />}
          label="Active Vendors"
          value={String(data.activeVendors)}
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Buyers"
          value={String(data.totalBuyers)}
        />
        <StatCard
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Total Orders"
          value={String(data.totalOrders)}
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="GMV"
          value={`₹${data.totalGMV.toFixed(0)}`}
        />
      </div>

      {/* Top vendors */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top Vendors</h3>
        {data.topVendors.length === 0 ? (
          <p className="text-sm text-gray-500">No vendor activity yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-left">
              <tr>
                <th className="py-2">Shop</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Sales</th>
                <th className="py-2">Commission Paid</th>
                <th className="py-2">Orders</th>
              </tr>
            </thead>
            <tbody>
              {data.topVendors.map((v) => (
                <tr key={v.shopName} className="border-t border-gray-100">
                  <td className="py-2 font-medium text-gray-900">
                    {v.shopName}
                  </td>
                  <td className="py-2">{v.plan}</td>
                  <td className="py-2">₹{v.totalSales.toFixed(0)}</td>
                  <td className="py-2">₹{v.commissionPaid.toFixed(0)}</td>
                  <td className="py-2">{v.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-xl p-5 ${
        highlight
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white border-gray-200"
      }`}
    >
      <div className={highlight ? "text-indigo-200 mb-2" : "text-indigo-600 mb-2"}>
        {icon}
      </div>
      <p className={`text-xs ${highlight ? "text-indigo-200" : "text-gray-500"}`}>
        {label}
      </p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}