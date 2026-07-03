"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getAuthUser } from "@/lib/auth";

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

export default function AdminVendorsPage() {
  const router = useRouter();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PENDING">("PENDING");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const user = getAuthUser();

    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    fetchVendors();
  }, [filter]);

  const fetchVendors = () => {
    setLoading(true);

    const endpoint =
      filter === "PENDING"
        ? "/admin/vendors/pending"
        : "/admin/vendors";

    api
      .get(endpoint)
      .then((res) => {
        console.log("SUCCESS:", res.data);
        console.log("VENDORS:", res.data?.data);

        setVendors(
          Array.isArray(res.data?.data)
            ? res.data.data
            : []
        );
      })
      .catch((err) => {
        console.error("ERROR STATUS:", err.response?.status);
        console.error("ERROR DATA:", err.response?.data);
        console.error("FULL ERROR:", err);

        setVendors([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateStatus = async (
    vendorId: number,
    status: string
  ) => {
    setUpdating(vendorId);

    try {
      await api.put(
        `/admin/vendors/${vendorId}/status`,
        { status }
      );

      fetchVendors();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Vendor Management
      </h1>

      <div className="flex gap-2 mb-6">
        {(["PENDING", "ALL"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              filter === f
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {f === "PENDING"
              ? "Pending Approval"
              : "All Vendors"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : vendors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
          No vendors found.
        </div>
      ) : (
        <div className="space-y-4">
          {vendors.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {v.shopName}
                </p>

                <p className="text-sm text-gray-500">
                  {v.user?.name} · {v.user?.email} · {v.user?.phone}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  {v.shopDescription}
                </p>

                <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {v.status} · {v.plan} plan ·{" "}
                  {v.commissionRate}% commission
                </span>
              </div>

              <div className="flex gap-2">
                {v.status === "PENDING" && (
                  <>
                    <button
                      disabled={updating === v.id}
                      onClick={() =>
                        updateStatus(v.id, "APPROVED")
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      disabled={updating === v.id}
                      onClick={() =>
                        updateStatus(v.id, "REJECTED")
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}

                {v.status === "APPROVED" && (
                  <button
                    disabled={updating === v.id}
                    onClick={() =>
                      updateStatus(v.id, "SUSPENDED")
                    }
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    Suspend
                  </button>
                )}

                {v.status === "SUSPENDED" && (
                  <button
                    disabled={updating === v.id}
                    onClick={() =>
                      updateStatus(v.id, "APPROVED")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Reinstate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}