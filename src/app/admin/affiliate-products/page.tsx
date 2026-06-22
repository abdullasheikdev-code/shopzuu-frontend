"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Category } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";

export default function AffiliateProductsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    affiliateUrl: "",
    affiliateSource: "",
    imageUrl: "",
    isFeatured: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    api.get("/categories").then((res) => setCategories(res.data.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      await api.post("/admin/affiliate-products", {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice
          ? parseFloat(form.discountPrice)
          : null,
        categoryId: parseInt(form.categoryId),
        affiliateUrl: form.affiliateUrl,
        affiliateSource: form.affiliateSource,
        images: form.imageUrl ? [form.imageUrl] : [],
        isFeatured: form.isFeatured,
      });

      setMessage("Affiliate product added successfully");
      setForm({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        categoryId: "",
        affiliateUrl: "",
        affiliateSource: "",
        imageUrl: "",
        isFeatured: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Add Affiliate Product
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Paste a product from Amazon, Flipkart, Myntra, Meesho, or any
        platform you're partnered with. It will appear in your catalog with a
        link straight to the original listing.
      </p>

      {message && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg p-3 mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">
            Product name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Discount price (optional)
            </label>
            <input
              type="number"
              value={form.discountPrice}
              onChange={(e) =>
                setForm({ ...form, discountPrice: e.target.value })
              }
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              required
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Platform name
            </label>
            <input
              required
              value={form.affiliateSource}
              onChange={(e) =>
                setForm({ ...form, affiliateSource: e.target.value })
              }
              placeholder="Amazon, Flipkart, Myntra..."
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Affiliate link (with your tracking tag)
          </label>
          <input
            required
            value={form.affiliateUrl}
            onChange={(e) =>
              setForm({ ...form, affiliateUrl: e.target.value })
            }
            placeholder="https://amazon.in/dp/XXXXX?tag=yourid-21"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="Paste the product image URL"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) =>
              setForm({ ...form, isFeatured: e.target.checked })
            }
          />
          Show on homepage as featured
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Adding..." : "Add Affiliate Product"}
        </button>
      </form>
    </div>
  );
}