"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { Trash2, MapPin } from "lucide-react";

interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    setLoading(true);
    api
      .get("/addresses")
      .then((res) => setAddresses(res.data.data))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/addresses", form);
      setShowForm(false);
      setForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
      fetchAddresses();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    await api.delete(`/addresses/${id}`);
    fetchAddresses();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              required
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <input
            required
            placeholder="Address line 1"
            value={form.addressLine1}
            onChange={(e) =>
              setForm({ ...form, addressLine1: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            placeholder="Address line 2 (optional)"
            value={form.addressLine2}
            onChange={(e) =>
              setForm({ ...form, addressLine2: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              required
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              required
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
            />
            Set as default address
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Address"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : addresses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No addresses saved yet.
        </p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {addr.fullName}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-gray-500">{addr.phone}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}