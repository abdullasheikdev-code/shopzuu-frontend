"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

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

const applyFilters = (products: Product[]) => {
  let filtered = [...products];

  if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));

  if (sortBy === "price_low") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price_high") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

  return filtered;
};

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

  useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      try {
        let res;

        if (keyword.trim()) {
          res = await api.get(
            `/products/search?keyword=${keyword}`
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        All Products
      </h1>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-6">
  <input
    type="number"
    placeholder="Min ₹"
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
    className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
  />
  <input
    type="number"
    placeholder="Max ₹"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
  />
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
  >
    <option value="newest">Newest</option>
    <option value="price_low">Price: Low to High</option>
    <option value="price_high">Price: High to Low</option>
    <option value="rating">Top Rated</option>
  </select>
</div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border ${
            !activeCategory
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          All
        </button>

        {(categories ?? []).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(String(cat.id))}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border ${
              activeCategory === String(cat.id)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">
          Loading products...
        </p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}