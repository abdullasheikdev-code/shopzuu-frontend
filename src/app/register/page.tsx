"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  User,
  Users,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"BUYER" | "VENDOR">(
    "BUYER"
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    shopName: "",
    shopDescription: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const payload: any = {
        ...form,
        role,
      };

      if (role === "BUYER") {
        delete payload.shopName;
        delete payload.shopDescription;
      }

      const res = await api.post(
        "/auth/register",
        payload
      );

      const data = res.data.data;

      saveAuth(data.token, {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        vendorId: data.vendorId,
      });

      if (data.role === "VENDOR") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#f7f7fb]">
      {/* BACKGROUND */}
      <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-[130px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-200/40 blur-[130px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#0b1020] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <div className="absolute -left-40 top-24 h-[450px] w-[450px] rounded-full bg-indigo-600/30 blur-[120px]" />

          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-[140px]" />

          {/* BRAND */}
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <span className="text-2xl font-black tracking-[-0.04em] text-white">
                Shopzuu
              </span>
            </Link>
          </div>

          {/* CONTENT */}
          <div className="relative max-w-xl py-12">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold text-indigo-200">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              Join the Shopzuu marketplace
            </div>

            <h1 className="text-5xl font-black leading-[1.03] tracking-[-0.05em] text-white xl:text-6xl">
              One marketplace.
              <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                Two ways to grow.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-slate-300">
              Create your account to discover products
              you love or start building your own business
              with Shopzuu.
            </p>

            <div className="mt-10 space-y-4">
              <BenefitItem
                icon={<ShoppingBag className="h-4 w-4" />}
                text="Discover products from independent sellers"
              />

              <BenefitItem
                icon={<Store className="h-4 w-4" />}
                text="Create your own Shopzuu storefront"
              />

              <BenefitItem
                icon={<ShieldCheck className="h-4 w-4" />}
                text="Secure accounts and protected shopping"
              />
            </div>
          </div>

          <div className="relative flex items-center gap-3 text-xs text-slate-400">
            <Users className="h-4 w-4 text-indigo-300" />
            Built for buyers and growing sellers
          </div>
        </section>

        {/* RIGHT FORM */}
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
          <div className="w-full max-w-[560px]">
            {/* MOBILE BRAND */}
            <Link
              href="/"
              className="mb-9 inline-flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-950 text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <span className="text-2xl font-black tracking-[-0.04em] text-gray-950">
                Shopzuu
              </span>
            </Link>

            {/* HEADING */}
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                Create your account
              </p>

              <h2 className="text-4xl font-black tracking-[-0.045em] text-gray-950 sm:text-5xl">
                Join Shopzuu
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
                Choose how you want to use the marketplace.
              </p>
            </div>

            {/* ROLE SELECTOR */}
            <div className="mt-8 grid grid-cols-2 gap-3 rounded-[24px] border border-gray-200 bg-white p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setRole("BUYER")}
                className={`flex min-h-[88px] items-center gap-3 rounded-[18px] px-4 text-left transition-all ${
                  role === "BUYER"
                    ? "bg-gray-950 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    role === "BUYER"
                      ? "bg-white/10 text-indigo-300"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-extrabold">
                    I want to buy
                  </p>

                  <p
                    className={`mt-1 hidden text-xs sm:block ${
                      role === "BUYER"
                        ? "text-slate-400"
                        : "text-gray-400"
                    }`}
                  >
                    Shop products
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("VENDOR")}
                className={`flex min-h-[88px] items-center gap-3 rounded-[18px] px-4 text-left transition-all ${
                  role === "VENDOR"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    role === "VENDOR"
                      ? "bg-white/15 text-white"
                      : "bg-violet-50 text-violet-600"
                  }`}
                >
                  <Store className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-extrabold">
                    I want to sell
                  </p>

                  <p
                    className={`mt-1 hidden text-xs sm:block ${
                      role === "VENDOR"
                        ? "text-indigo-200"
                        : "text-gray-400"
                    }`}
                  >
                    Build a store
                  </p>
                </div>
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-600">
                  !
                </div>

                <p className="text-sm font-semibold leading-6 text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Full name"
                  icon={<User className="h-5 w-5" />}
                >
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label="Phone number"
                  icon={<Phone className="h-5 w-5" />}
                >
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    placeholder="**********"
                    className={inputClass}
                  />
                </FormField>
              </div>

              <FormField
                label="Email address"
                icon={<Mail className="h-5 w-5" />}
              >
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </FormField>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-extrabold text-gray-800">
                  Password
                </label>

                <div className="group relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Minimum 6 characters"
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* VENDOR FIELDS */}
              {role === "VENDOR" && (
                <div className="space-y-5 rounded-[24px] border border-indigo-100 bg-indigo-50/50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Store className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-gray-950">
                        Tell us about your shop
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        These details will be used for your
                        seller profile.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-extrabold text-gray-800">
                      Shop name
                    </label>

                    <input
                      required
                      value={form.shopName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shopName: e.target.value,
                        })
                      }
                      placeholder="e.g. your brand name"
                      className="h-14 w-full rounded-2xl border border-indigo-100 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-extrabold text-gray-800">
                      Shop description
                    </label>

                    <textarea
                      value={form.shopDescription}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shopDescription:
                            e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Tell customers what your shop offers..."
                      className="w-full resize-none rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />

                    <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-indigo-700">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />

                      Your shop needs admin approval before
                      it goes live.
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 text-sm font-extrabold text-white shadow-xl shadow-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* LOGIN */}
            <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-extrabold text-indigo-600 hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Your account information is securely protected
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const inputClass =
  "h-14 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

function FormField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-extrabold text-gray-800">
        {label}
      </label>

      <div className="group relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600">
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}

function BenefitItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-indigo-300">
        {icon}
      </div>

      <span>{text}</span>

      <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
    </div>
  );
}