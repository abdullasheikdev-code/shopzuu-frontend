"use client";

import {
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  PackageSearch,
  X,
  Sparkles,
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState("");

  const [activeCategory, setActiveCategory] = useState<string | null>(
    categoryId
  );

  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // =========================
  // FETCH CATEGORIES
  // =========================

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        console.log("Categories Response:", res.data);

        setCategories(
          Array.isArray(res.data?.data)
            ? res.data.data
            : []
        );
      })
      .catch((err) => {
        console.error("Category Error:", err);
        setCategories([]);
      });
  }, []);

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      try {
        let res;

        if (keyword.trim()) {
          res = await api.get(
            `/products/search?keyword=${encodeURIComponent(
              keyword.trim()
            )}`
          );
        } else if (activeCategory) {
          res = await api.get(
            `/products/public/category/${activeCategory}`
          );
        } else {
          res = await api.get("/products/public/all");
        }

        setProducts(
          Array.isArray(res.data?.data)
            ? res.data.data
            : []
        );
      } catch (err) {
        console.error("Products Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);

    return () => clearTimeout(debounce);
  }, [keyword, activeCategory]);

  // =========================
  // FILTER + SORT
  // =========================

  const visibleProducts = useMemo(() => {
    let filtered = [...products];

    if (minPrice) {
      filtered = filtered.filter(
        (product) => getProductPrice(product) >= Number(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (product) => getProductPrice(product) <= Number(maxPrice)
      );
    }

    if (sortBy === "price_low") {
      filtered.sort(
        (a, b) => getProductPrice(a) - getProductPrice(b)
      );
    } else if (sortBy === "price_high") {
      filtered.sort(
        (a, b) => getProductPrice(b) - getProductPrice(a)
      );
    } else if (sortBy === "rating") {
      filtered.sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    }

    return filtered;
  }, [products, minPrice, maxPrice, sortBy]);

  const hasActiveFilters =
    minPrice !== "" ||
    maxPrice !== "" ||
    sortBy !== "newest";

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-blue-100/70 blur-3xl" />

        <div className="absolute -left-40 top-16 h-[360px] w-[360px] rounded-full bg-cyan-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            <Sparkles className="h-4 w-4" />
            Explore Shopzuu
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
            Find something
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              worth discovering.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Discover products from independent sellers and growing
            businesses across the Shopzuu marketplace.
          </p>

          {/* SEARCH */}

          <div className="mt-8 flex max-w-2xl items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_15px_50px_rgba(15,23,42,0.10)]">

            <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products, shops and more..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />

            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="mr-1 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= MAIN PRODUCTS ================= */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* CATEGORY LABEL */}

        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            Browse marketplace
          </p>
        </div>

        {/* CATEGORIES */}

        <div className="mb-9 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">

          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-all ${
              !activeCategory
                ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950"
            }`}
          >
            All products
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setActiveCategory(String(cat.id))
              }
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-all ${
                activeCategory === String(cat.id)
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* TOOLBAR */}

        <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {activeCategory
                ? categories.find(
                    (category) =>
                      String(category.id) === activeCategory
                  )?.name || "Products"
                : keyword
                ? `Results for "${keyword}"`
                : "All products"}
            </h2>

            <p className="mt-1.5 text-sm text-slate-500">
              {loading
                ? "Discovering products..."
                : `${visibleProducts.length} ${
                    visibleProducts.length === 1
                      ? "product"
                      : "products"
                  } found`}
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* FILTER BUTTON */}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${
                showFilters || hasActiveFilters
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />

              Filters

              {hasActiveFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] text-white">
                  !
                </span>
              )}
            </button>

            {/* SORT */}

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500"
              >
                <option value="newest">Newest</option>

                <option value="price_low">
                  Price: Low to High
                </option>

                <option value="price_high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Top Rated
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* ================= FILTER PANEL ================= */}

        {showFilters && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-black text-slate-950">
                  Refine products
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Narrow the marketplace to what you need.
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Minimum price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Maximum price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    placeholder="No limit"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LOADING SKELETON ================= */}

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">

            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[22px] border border-slate-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-slate-200" />

                <div className="space-y-3 p-4 sm:p-5">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />

                  <div className="h-5 w-full animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-7 w-24 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= PRODUCT GRID ================= */}

        {!loading && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">

            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!loading && visibleProducts.length === 0 && (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
              <PackageSearch className="h-9 w-9 text-slate-400" />
            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-950">
              No products found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try another search, choose a different category,
              or remove your price filters.
            </p>

            <button
              onClick={() => {
                setKeyword("");
                setActiveCategory(null);
                clearFilters();
              }}
              className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              Explore all products
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function getProductPrice(product: Product) {
  if (
    product.discountPrice != null &&
    product.discountPrice < product.price
  ) {
    return product.discountPrice;
  }

  return product.price;
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] p-8">
          <div className="mx-auto max-w-7xl">
            <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}