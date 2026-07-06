"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";
import {
  AlertTriangle,
  ArrowRight,
  Box,
  CheckCircle2,
  Edit3,
  Eye,
  IndianRupee,
  Package,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";

export default function VendorProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE" | "LOW_STOCK"
  >("ALL");

  useEffect(() => {
    const user = getAuthUser();

    if (!user || user.role !== "VENDOR") {
      router.push("/login");
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const res = await api.get("/vendor/products");

      setProducts(
        Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );
    } catch (err) {
      console.error("PRODUCT FETCH ERROR:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "Are you sure you want to permanently delete this product?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await api.delete(`/vendor/products/${id}`);

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    setTogglingId(id);

    try {
      const res = await api.put(
        `/vendor/products/${id}/toggle-featured`
      );

      const updated = res.data.data;

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                featured:
                  updated.featured ??
                  updated.isFeatured ??
                  !product.featured,
              }
            : product
        )
      );
    } catch (err) {
      alert("Failed to toggle featured status");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && product.active) ||
        (statusFilter === "INACTIVE" && !product.active) ||
        (statusFilter === "LOW_STOCK" &&
          product.stock > 0 &&
          product.stock <= 5);

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const activeProducts = products.filter(
    (product) => product.active
  ).length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const totalSold = products.reduce(
    (sum, product) => sum + product.totalSold,
    0
  );

  const totalRevenue = products.reduce((sum, product) => {
    const price =
      product.discountPrice &&
      product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

    return sum + price * product.totalSold;
  }, 0);

  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      {/* TOP HEADER */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Package className="h-4 w-4" />
                </div>

                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
                  Product Management
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                My Products
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                Manage your listings, inventory, pricing and featured
                products from one place.
              </p>
            </div>

            <Link
              href="/vendor/products/new"
              className="group flex h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-6 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Add New Product
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Box className="h-5 w-5" />}
            label="Total Products"
            value={String(products.length)}
            description={`${activeProducts} active`}
          />

          <StatCard
            icon={<Package className="h-5 w-5" />}
            label="Total Inventory"
            value={String(totalStock)}
            description="Units in stock"
          />

          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Units Sold"
            value={String(totalSold)}
            description="All-time sales"
          />

          <StatCard
            icon={<IndianRupee className="h-5 w-5" />}
            label="Product Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}`}
            description="Estimated revenue"
          />
        </div>

        {/* SEARCH + FILTER */}
        <div className="mb-6 rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your products..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              <FilterButton
                active={statusFilter === "ALL"}
                onClick={() => setStatusFilter("ALL")}
              >
                All
              </FilterButton>

              <FilterButton
                active={statusFilter === "ACTIVE"}
                onClick={() => setStatusFilter("ACTIVE")}
              >
                Active
              </FilterButton>

              <FilterButton
                active={statusFilter === "INACTIVE"}
                onClick={() => setStatusFilter("INACTIVE")}
              >
                Inactive
              </FilterButton>

              <FilterButton
                active={statusFilter === "LOW_STOCK"}
                onClick={() => setStatusFilter("LOW_STOCK")}
              >
                Low Stock
              </FilterButton>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <ProductSkeleton />
        ) : products.length === 0 ? (
          <EmptyProducts />
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <Search className="mx-auto mb-4 h-10 w-10 text-gray-300" />

            <h3 className="font-bold text-gray-900">
              No matching products
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or change your filter.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Product
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Inventory
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Sales
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Featured
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        deletingId={deletingId}
                        togglingId={togglingId}
                        onDelete={handleDelete}
                        onToggleFeatured={handleToggleFeatured}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 md:hidden">
              {filteredProducts.map((product) => (
                <MobileProductCard
                  key={product.id}
                  product={product}
                  deletingId={deletingId}
                  togglingId={togglingId}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ProductRow({
  product,
  deletingId,
  togglingId,
  onDelete,
  onToggleFeatured,
}: {
  product: Product;
  deletingId: number | null;
  togglingId: number | null;
  onDelete: (id: number) => void;
  onToggleFeatured: (id: number) => void;
}) {
  const hasDiscount =
    product.discountPrice &&
    product.discountPrice < product.price;

  const displayPrice = hasDiscount
    ? product.discountPrice
    : product.price;

  const isLowStock =
    product.stock > 0 && product.stock <= 5;

  return (
    <tr className="group border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50/70">
      <td className="px-6 py-5">
        <div className="flex min-w-[240px] items-center gap-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-5 w-5 text-gray-300" />
              </div>
            )}
          </div>

          <div>
            <p className="max-w-[230px] truncate font-bold text-gray-950">
              {product.name}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Product #{product.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-5">
        <p className="font-bold text-gray-950">
          ₹{Number(displayPrice).toFixed(0)}
        </p>

        {hasDiscount && (
          <p className="mt-0.5 text-xs text-gray-400 line-through">
            ₹{product.price.toFixed(0)}
          </p>
        )}
      </td>

      <td className="px-5 py-5">
        <div>
          <p
            className={`font-bold ${
              product.stock === 0
                ? "text-red-600"
                : isLowStock
                ? "text-amber-600"
                : "text-gray-900"
            }`}
          >
            {product.stock}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {product.stock === 0
              ? "Out of stock"
              : isLowStock
              ? "Low stock"
              : "In stock"}
          </p>
        </div>
      </td>

      <td className="px-5 py-5">
        <p className="font-bold text-gray-900">
          {product.totalSold}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          units sold
        </p>
      </td>

      <td className="px-5 py-5">
        <StatusBadge active={product.active} />
      </td>

      <td className="px-5 py-5">
        <button
          disabled={togglingId === product.id}
          onClick={() => onToggleFeatured(product.id)}
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition-all disabled:opacity-50 ${
            product.featured
              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Star
            className={`h-3.5 w-3.5 ${
              product.featured
                ? "fill-amber-500 text-amber-500"
                : ""
            }`}
          />

          {togglingId === product.id
            ? "Updating..."
            : product.featured
            ? "Featured"
            : "Feature"}
        </button>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/products/${product.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600"
            title="View product"
          >
            <Eye className="h-4 w-4" />
          </Link>

          <Link
            href={`/vendor/products/${product.id}/edit`}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600"
            title="Edit product"
          >
            <Edit3 className="h-4 w-4" />
          </Link>

          <button
            disabled={deletingId === product.id}
            onClick={() => onDelete(product.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            title="Delete product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function MobileProductCard({
  product,
  deletingId,
  togglingId,
  onDelete,
  onToggleFeatured,
}: {
  product: Product;
  deletingId: number | null;
  togglingId: number | null;
  onDelete: (id: number) => void;
  onToggleFeatured: (id: number) => void;
}) {
  const hasDiscount =
    product.discountPrice &&
    product.discountPrice < product.price;

  const displayPrice = hasDiscount
    ? product.discountPrice
    : product.price;

  return (
    <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-6 w-6 text-gray-300" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-bold text-gray-950">
                {product.name}
              </h3>

              <p className="mt-1 text-lg font-black text-gray-950">
                ₹{Number(displayPrice).toFixed(0)}
              </p>
            </div>

            <StatusBadge active={product.active} />
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span>
              <strong className="text-gray-900">
                {product.stock}
              </strong>{" "}
              stock
            </span>

            <span>
              <strong className="text-gray-900">
                {product.totalSold}
              </strong>{" "}
              sold
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          disabled={togglingId === product.id}
          onClick={() => onToggleFeatured(product.id)}
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
            product.featured
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <Star
            className={`h-3.5 w-3.5 ${
              product.featured
                ? "fill-amber-500 text-amber-500"
                : ""
            }`}
          />

          {product.featured ? "Featured" : "Feature"}
        </button>

        <div className="flex items-center gap-1">
          <Link
            href={`/products/${product.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
          >
            <Eye className="h-4 w-4" />
          </Link>

          <Link
            href={`/vendor/products/${product.id}/edit`}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Edit3 className="h-4 w-4" />
          </Link>

          <button
            disabled={deletingId === product.id}
            onClick={() => onDelete(product.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {active ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <AlertTriangle className="h-3.5 w-3.5" />
      )}

      {active ? "Active" : "Inactive"}
    </span>
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
    <div className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <p className="text-xs font-semibold text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight text-gray-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
        active
          ? "bg-gray-950 text-white shadow-md"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyProducts() {
  return (
    <div className="rounded-[32px] border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
        <Sparkles className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-black text-gray-950">
        Add your first product
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Start building your Shopzuu storefront by creating your first
        product listing.
      </p>

      <Link
        href="/vendor/products/new"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
      >
        <Plus className="h-4 w-4" />
        Add Your First Product
      </Link>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-gray-100 p-5 last:border-0"
        >
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-100" />

          <div className="flex-1">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="hidden h-4 w-20 animate-pulse rounded bg-gray-100 sm:block" />
          <div className="hidden h-8 w-24 animate-pulse rounded-full bg-gray-100 md:block" />
        </div>
      ))}
    </div>
  );
}