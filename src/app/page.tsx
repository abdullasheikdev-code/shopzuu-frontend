import Link from "next/link";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

async function getCategories(): Promise<Category[]> {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is missing");
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/categories`, {
      next: {
        revalidate: 300,
        tags: ["homepage-categories"],
      },
    });

    if (!response.ok) {
      console.error(
        "CATEGORY FETCH FAILED:",
        response.status,
        response.statusText
      );

      return [];
    }

    const result = await response.json();

    return Array.isArray(result?.data)
      ? result.data
      : [];
  } catch (error) {
    console.error("CATEGORY FETCH ERROR:", error);

    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is missing");
    return [];
  }

  try {
    const response = await fetch(
      `${API_URL}/products/featured`,
      {
        next: {
          revalidate: 300,
          tags: ["homepage-featured"],
        },
      }
    );

    if (!response.ok) {
      console.error(
        "FEATURED FETCH FAILED:",
        response.status,
        response.statusText
      );

      return [];
    }

    const result = await response.json();

    return Array.isArray(result?.data)
      ? result.data
      : [];
  } catch (error) {
    console.error("FEATURED FETCH ERROR:", error);

    return [];
  }
}

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <main className="overflow-hidden bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0b1020] text-white">
        {/* Background decorations */}
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-600/25 blur-[120px]" />

        <div className="absolute -right-32 -top-20 h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-[140px]" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px]" />

        <div className="relative mx-auto grid min-h-[610px] max-w-[1440px] items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          {/* Hero content */}
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-100 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-pink-400" />
              Discover products from independent sellers
            </div>

            <h1 className="text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[72px]">
              Shop different.

              <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                Support real sellers.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
              Discover quality products from growing businesses across India.
              Better discoveries, fair prices, and a marketplace built around
              real people.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/products"
                className="group flex h-14 items-center gap-2 rounded-full bg-white px-7 text-sm font-extrabold text-gray-950 shadow-[0_15px_40px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(255,255,255,0.22)]"
              >
                Start Shopping

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/become-vendor"
                className="group flex h-14 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-sm font-bold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
              >
                <Store className="h-4 w-4" />
                Sell on Shopzuu
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400 lg:justify-start">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Verified sellers
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Secure shopping
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Easy ordering
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto hidden w-full max-w-[520px] lg:block">
            <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 blur-3xl" />

            <div className="relative rotate-2 rounded-[36px] border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.08] p-7">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">
                      Shopzuu Marketplace
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Find something special
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 shadow-lg">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-gradient-to-br from-indigo-500/30 to-indigo-500/10 p-5">
                    <PackageCheck className="mb-10 h-7 w-7 text-indigo-300" />

                    <p className="font-bold">
                      Quality Products
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      From growing sellers
                    </p>
                  </div>

                  <div className="mt-7 rounded-3xl bg-gradient-to-br from-pink-500/30 to-pink-500/10 p-5">
                    <BadgePercent className="mb-10 h-7 w-7 text-pink-300" />

                    <p className="font-bold">
                      Fair Prices
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Better value for you
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div>
                    <p className="text-sm text-slate-400">
                      Ready to discover?
                    </p>

                    <p className="mt-1 font-bold">
                      Explore the marketplace
                    </p>
                  </div>

                  <Link
                    href="/products"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-950 transition-transform hover:scale-110"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative border-t border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <TrustItem
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Verified sellers"
              description="Shop with more confidence"
            />

            <TrustItem
              icon={<Truck className="h-5 w-5" />}
              title="Fast dispatch"
              description="Orders prepared quickly"
            />

            <TrustItem
              icon={<BadgePercent className="h-5 w-5" />}
              title="Fair pricing"
              description="More value, fewer barriers"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="relative bg-[#fafafa] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                Explore Shopzuu
              </p>

              <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Shop by category
              </h2>

              <p className="mt-3 max-w-xl text-gray-500">
                Find what you need faster and discover products from sellers
                across the marketplace.
              </p>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-2 text-sm font-bold text-gray-700 transition-colors hover:text-indigo-600 sm:flex"
            >
              Explore all

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              Categories will appear here soon.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {categories.slice(0, 8).map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="group relative min-h-[150px] overflow-hidden rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl"
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-50 transition-transform duration-500 group-hover:scale-150" />

                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-950 text-sm font-black text-white shadow-lg">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="mt-8 flex items-end justify-between gap-2">
                      <p className="font-extrabold text-gray-950">
                        {cat.name}
                      </p>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-500" />

                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-pink-600">
                  Handpicked for you
                </p>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Featured products
              </h2>

              <p className="mt-3 text-gray-500">
                Discover standout products worth checking out.
              </p>
            </div>

            <Link
              href="/products"
              className="group flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
            >
              <span className="hidden sm:inline">
                View all products
              </span>

              <span className="sm:hidden">
                View all
              </span>

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>

              <h3 className="font-bold text-gray-900">
                New products are coming
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Check back soon for featured discoveries.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VENDOR CTA */}
      <section className="px-4 pb-20 pt-4 sm:px-6 sm:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#101525] px-6 py-14 text-white shadow-2xl sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-[100px]" />

          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-pink-500/20 blur-[100px]" />

          <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-200">
                <Store className="h-4 w-4" />
                Built for growing sellers
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                Your products deserve

                <span className="block text-indigo-300">
                  a bigger audience.
                </span>
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                Build your storefront, list your products, manage orders, and
                grow your business on Shopzuu.
              </p>
            </div>

            <Link
              href="/become-vendor"
              className="group flex h-14 shrink-0 items-center gap-2 rounded-full bg-white px-7 text-sm font-extrabold text-gray-950 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Become a Vendor

              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 px-6 py-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-indigo-300">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-white">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}