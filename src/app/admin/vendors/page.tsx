"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Store,
  User,
  X,
  XCircle,
} from "lucide-react";

interface Vendor {
  id: number;
  shopName: string;
  shopDescription: string;
  status: string;
  plan: string;
  commissionRate: number;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

type FilterType = "ALL" | "PENDING";

export default function AdminVendorsPage() {
  const router = useRouter();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filter, setFilter] = useState<FilterType>("PENDING");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = getAuthUser();

    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    fetchVendors();
  }, [filter]);

  const fetchVendors = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const endpoint =
      filter === "PENDING"
        ? "/admin/vendors/pending"
        : "/admin/vendors";

    try {
      const res = await api.get(endpoint);

      setVendors(
        Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );
    } catch (err: any) {
      setVendors([]);

      setError(
        err.response?.data?.message ||
          "Failed to load vendors."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (
    vendorId: number,
    status: string
  ) => {
    setUpdating(vendorId);
    setError("");
    setSuccess("");

    try {
      await api.put(
        `/admin/vendors/${vendorId}/status`,
        { status }
      );

      const messages: Record<string, string> = {
        APPROVED: "Vendor approved successfully.",
        REJECTED: "Vendor application rejected.",
        SUSPENDED: "Vendor suspended successfully.",
      };

      setSuccess(
        messages[status] ||
          "Vendor status updated successfully."
      );

      await fetchVendors();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update vendor status."
      );
    } finally {
      setUpdating(null);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      vendor.shopName?.toLowerCase().includes(query) ||
      vendor.user?.name?.toLowerCase().includes(query) ||
      vendor.user?.email?.toLowerCase().includes(query)
    );
  });

  const pendingCount = vendors.filter(
    (vendor) => vendor.status === "PENDING"
  ).length;

  const approvedCount = vendors.filter(
    (vendor) => vendor.status === "APPROVED"
  ).length;

  const suspendedCount = vendors.filter(
    (vendor) => vendor.status === "SUSPENDED"
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      {/* HEADER */}
      <section className="relative overflow-hidden bg-[#0b1020] text-white">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-indigo-600/25 blur-[110px]" />
        <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <Link
            href="/admin/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-indigo-200">
                <Building2 className="h-4 w-4" />
                Seller Administration
              </div>

              <h1 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Vendor Management
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Review applications, approve sellers, and manage
                vendor access across the Shopzuu marketplace.
              </p>
            </div>

            <button
              onClick={() => fetchVendors(true)}
              disabled={refreshing}
              className="flex h-11 w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold transition hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* MESSAGES */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <span>{error}</span>

            <button onClick={() => setError("")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            <span>{success}</span>

            <button onClick={() => setSuccess("")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STATS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Pending Approval"
            value={pendingCount}
            type="pending"
          />

          <SummaryCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Approved Vendors"
            value={approvedCount}
            type="approved"
          />

          <SummaryCard
            icon={<ShieldAlert className="h-5 w-5" />}
            label="Suspended Vendors"
            value={suspendedCount}
            type="suspended"
          />
        </div>

        {/* CONTROLS */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("PENDING")}
              className={`relative rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                filter === "PENDING"
                  ? "bg-gray-950 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Pending Approval
            </button>

            <button
              onClick={() => setFilter("ALL")}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                filter === "ALL"
                  ? "bg-gray-950 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              All Vendors
            </button>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shop, owner or email..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <VendorSkeleton />
        ) : filteredVendors.length === 0 ? (
          <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Store className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-lg font-black text-gray-950">
              {search
                ? "No matching vendors"
                : filter === "PENDING"
                ? "No pending applications"
                : "No vendors found"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {search
                ? "Try searching with a different shop name, owner, or email."
                : filter === "PENDING"
                ? "All vendor applications have been reviewed."
                : "Vendor accounts will appear here after registration."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                updating={updating === vendor.id}
                onUpdateStatus={updateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function VendorCard({
  vendor,
  updating,
  onUpdateStatus,
}: {
  vendor: Vendor;
  updating: boolean;
  onUpdateStatus: (
    vendorId: number,
    status: string
  ) => void;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row">
          {/* INFORMATION */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-white shadow-lg">
                <Store className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-black text-gray-950">
                    {vendor.shopName}
                  </h2>

                  <StatusBadge status={vendor.status} />

                  <PlanBadge plan={vendor.plan} />
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                  {vendor.shopDescription ||
                    "No shop description provided."}
                </p>
              </div>
            </div>

            {/* OWNER INFORMATION */}
            <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2 xl:grid-cols-3">
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Owner"
                value={vendor.user?.name || "Not provided"}
              />

              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={vendor.user?.email || "Not provided"}
              />

              <InfoItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={vendor.user?.phone || "Not provided"}
              />
            </div>
          </div>

          {/* PLAN DETAILS */}
          <div className="flex min-w-[210px] flex-col justify-between rounded-2xl bg-gray-50 p-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-400">
                Seller Terms
              </p>

              <div className="mt-4">
                <p className="text-xs text-gray-500">
                  Commission rate
                </p>

                <p className="mt-1 text-2xl font-black text-gray-950">
                  {vendor.commissionRate}%
                </p>
              </div>
            </div>

            <div className="mt-6">
              <VendorActions
                vendor={vendor}
                updating={updating}
                onUpdateStatus={onUpdateStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function VendorActions({
  vendor,
  updating,
  onUpdateStatus,
}: {
  vendor: Vendor;
  updating: boolean;
  onUpdateStatus: (
    vendorId: number,
    status: string
  ) => void;
}) {
  if (vendor.status === "PENDING") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={updating}
          onClick={() =>
            onUpdateStatus(vendor.id, "APPROVED")
          }
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {updating ? "..." : "Approve"}
        </button>

        <button
          disabled={updating}
          onClick={() =>
            onUpdateStatus(vendor.id, "REJECTED")
          }
          className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          {updating ? "..." : "Reject"}
        </button>
      </div>
    );
  }

  if (vendor.status === "APPROVED") {
    return (
      <button
        disabled={updating}
        onClick={() =>
          onUpdateStatus(vendor.id, "SUSPENDED")
        }
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
      >
        <ShieldAlert className="h-4 w-4" />
        {updating ? "Updating..." : "Suspend Vendor"}
      </button>
    );
  }

  if (vendor.status === "SUSPENDED") {
    return (
      <button
        disabled={updating}
        onClick={() =>
          onUpdateStatus(vendor.id, "APPROVED")
        }
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        <RotateCcw className="h-4 w-4" />
        {updating ? "Updating..." : "Reinstate Vendor"}
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-gray-100 px-4 py-3 text-center text-xs font-bold text-gray-500">
      No actions available
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
    SUSPENDED: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-700",
    BASIC: "bg-indigo-50 text-indigo-700",
    PRO: "bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
        styles[plan] || "bg-gray-100 text-gray-700"
      }`}
    >
      {plan} PLAN
    </span>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  type: "pending" | "approved" | "suspended";
}) {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    suspended: "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles[type]}`}
        >
          {icon}
        </div>

        <p className="text-3xl font-black text-gray-950">
          {value}
        </p>
      </div>

      <p className="mt-4 text-sm font-bold text-gray-700">
        {label}
      </p>
    </div>
  );
}

function VendorSkeleton() {
  return (
    <div className="space-y-5">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="h-64 animate-pulse rounded-[28px] bg-gray-200"
        />
      ))}
    </div>
  );
}