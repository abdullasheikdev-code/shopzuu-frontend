"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Category, Product } from "@/lib/types";
import {
  AlertCircle,
  ArrowLeft,
  BadgePercent,
  Check,
  ChevronDown,
  ImageIcon,
  IndianRupee,
  Loader2,
  Package,
  Save,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

interface Props {
  productId?: number;
}

export default function ProductForm({ productId }: Props) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    categoryId: "",
    featured: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(!!productId);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryRes = await api.get("/categories");

        setCategories(
          Array.isArray(categoryRes.data?.data)
            ? categoryRes.data.data
            : []
        );
      } catch (err) {
        console.error("CATEGORY LOAD ERROR:", err);
      }

      if (productId) {
        try {
          const res = await api.get(
            `/products/public/${productId}`
          );

          const product: Product = res.data.data;

          setForm({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price ?? ""),
            discountPrice: product.discountPrice
              ? String(product.discountPrice)
              : "",
            stock: String(product.stock ?? ""),
            categoryId: String(
              (product as any).categoryId ??
                (product as any).category?.id ??
                ""
            ),
            featured: product.featured || false,
          });

          setImages(product.images || []);
        } catch (err) {
          console.error("PRODUCT LOAD ERROR:", err);
          setError("Failed to load product details");
        } finally {
          setLoadingProduct(false);
        }
      }
    };

    loadData();
  }, [productId]);

  const finalPrice = useMemo(() => {
    const price = Number(form.price);
    const discountPrice = Number(form.discountPrice);

    if (
      form.discountPrice &&
      discountPrice >= 0 &&
      discountPrice < price
    ) {
      return discountPrice;
    }

    return price || 0;
  }, [form.price, form.discountPrice]);

  const discountPercent = useMemo(() => {
    const price = Number(form.price);
    const discountPrice = Number(form.discountPrice);

    if (
      !price ||
      !form.discountPrice ||
      discountPrice >= price
    ) {
      return 0;
    }

    return Math.round(
      ((price - discountPrice) / price) * 100
    );
  }, [form.price, form.discountPrice]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(
        "/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImages((prev) => [
        ...prev,
        res.data.data,
      ]);
    } catch (err) {
      console.error("IMAGE UPLOAD ERROR:", err);
      setError("Image upload failed");
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (images.length === 0) {
      setError(
        "Please upload at least one product image"
      );
      return;
    }

    const price = Number(form.price);
    const discountPrice = form.discountPrice
      ? Number(form.discountPrice)
      : null;

    if (
      discountPrice !== null &&
      discountPrice >= price
    ) {
      setError(
        "Discount price must be lower than the regular price"
      );
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        discountPrice: form.discountPrice
          ? parseFloat(form.discountPrice)
          : null,
        stock: parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
        images,
        featured: form.featured,
      };

      if (productId) {
        await api.put(
          `/vendor/products/${productId}`,
          payload
        );
      } else {
        await api.post(
          "/vendor/products",
          payload
        );
      }

      router.push("/vendor/products");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingProduct) {
    return <FormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">
                Something needs attention
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* BASIC INFORMATION */}
        <FormSection
          icon={<Package className="h-5 w-5" />}
          title="Product information"
          description="Add the main details buyers will see."
        >
          <div className="space-y-5">
            <Field>
              <Label required>
                Product name
              </Label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Enter a clear product name"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-gray-400">
                Use a short, descriptive title that
                buyers can easily understand.
              </p>
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <Label required>
                  Description
                </Label>

                <span className="text-xs text-gray-400">
                  {form.description.length} characters
                </span>
              </div>

              <textarea
                required
                rows={7}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your product, its features, materials and other useful details..."
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>
        </FormSection>

        {/* PRICING */}
        <FormSection
          icon={<IndianRupee className="h-5 w-5" />}
          title="Pricing"
          description="Set your regular and discounted prices."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <Label required>
                Regular price
              </Label>

              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  placeholder="0"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field>
              <Label>
                Discount price
              </Label>

              <div className="relative">
                <BadgePercent className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.discountPrice}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountPrice:
                        e.target.value,
                    })
                  }
                  placeholder="Optional"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          </div>

          {discountPercent > 0 && (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div>
                <p className="text-sm font-bold text-emerald-800">
                  Discount applied
                </p>

                <p className="mt-1 text-xs text-emerald-600">
                  Buyers will save {discountPercent}%
                </p>
              </div>

              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-black text-emerald-700 shadow-sm">
                {discountPercent}% OFF
              </span>
            </div>
          )}
        </FormSection>

        {/* INVENTORY */}
        <FormSection
          icon={<Package className="h-5 w-5" />}
          title="Inventory & category"
          description="Organize your product and manage available stock."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <Label required>
                Stock quantity
              </Label>

              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: e.target.value,
                  })
                }
                placeholder="0"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-gray-400">
                Enter 0 if the product is currently
                unavailable.
              </p>
            </Field>

            <Field>
              <Label required>
                Category
              </Label>

              <div className="relative">
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoryId:
                        e.target.value,
                    })
                  }
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </Field>
          </div>
        </FormSection>

        {/* IMAGES */}
        <FormSection
          icon={<ImageIcon className="h-5 w-5" />}
          title="Product images"
          description="Upload clear images that show your product."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-[22px] border border-gray-200 bg-gray-100"
              >
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {index === 0 && (
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                    COVER
                  </span>
                )}

                <button
                  type="button"
                  onClick={() =>
                    removeImage(index)
                  }
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            <label
              className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed transition-all ${
                uploading
                  ? "cursor-not-allowed border-indigo-200 bg-indigo-50"
                  : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />

              {uploading ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />

                  <span className="mt-3 text-xs font-bold text-indigo-600">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                    <Upload className="h-5 w-5" />
                  </div>

                  <span className="mt-3 text-sm font-bold text-gray-700">
                    Add image
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    JPG, PNG or WEBP
                  </span>
                </>
              )}
            </label>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
            <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

            <p className="text-xs leading-5 text-gray-500">
              The first image will be used as the
              product cover. Upload clear, well-lit
              images for better visibility.
            </p>
          </div>
        </FormSection>

        {/* FEATURED */}
        <div
          onClick={() =>
            setForm((current) => ({
              ...current,
              featured: !current.featured,
            }))
          }
          className={`cursor-pointer rounded-[28px] border p-6 transition-all ${
            form.featured
              ? "border-indigo-300 bg-indigo-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-indigo-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                form.featured
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-gray-950">
                    Request featured placement
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Request additional visibility for
                    this product in featured sections.
                  </p>
                </div>

                <div
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    form.featured
                      ? "bg-indigo-600"
                      : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      form.featured
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <input
            type="checkbox"
            checked={form.featured}
            onChange={() => {}}
            className="hidden"
          />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
        {/* PREVIEW */}
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-gray-400">
              Live Preview
            </p>
          </div>

          <div className="p-5">
            <div className="aspect-square overflow-hidden rounded-[22px] bg-gray-100">
              {images[0] ? (
                <img
                  src={images[0]}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-300">
                  <ImageIcon className="h-10 w-10" />

                  <p className="mt-3 text-xs font-semibold">
                    Product image
                  </p>
                </div>
              )}
            </div>

            <div className="pt-5">
              <p className="text-xs font-bold text-indigo-600">
                Your Shop
              </p>

              <h3 className="mt-1 line-clamp-2 font-black text-gray-950">
                {form.name || "Your product name"}
              </h3>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-950">
                  ₹{finalPrice.toFixed(0)}
                </span>

                {discountPercent > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{Number(form.price).toFixed(0)}
                  </span>
                )}
              </div>

              {discountPercent > 0 && (
                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* COMPLETION */}
        <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-black text-gray-950">
            Listing checklist
          </h3>

          <div className="mt-5 space-y-3">
            <ChecklistItem
              complete={form.name.trim().length > 0}
              label="Product name"
            />

            <ChecklistItem
              complete={
                form.description.trim().length > 0
              }
              label="Product description"
            />

            <ChecklistItem
              complete={Number(form.price) > 0}
              label="Valid price"
            />

            <ChecklistItem
              complete={!!form.categoryId}
              label="Category selected"
            />

            <ChecklistItem
              complete={images.length > 0}
              label="Product image"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-4 text-sm font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving product...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {productId
                  ? "Update Product"
                  : "Publish Product"}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/vendor/products")
            }
            disabled={saving}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </aside>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100";

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <div>
          <h2 className="font-black text-gray-950">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

function Label({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-bold text-gray-700">
      {children}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>
  );
}

function ChecklistItem({
  complete,
  label,
}: {
  complete: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          complete
            ? "bg-emerald-100 text-emerald-600"
            : "bg-gray-100 text-gray-300"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </div>

      <span
        className={`text-sm ${
          complete
            ? "font-semibold text-gray-700"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-[28px] border border-gray-200 bg-white p-6"
          >
            <div className="h-5 w-44 animate-pulse rounded bg-gray-100" />

            <div className="mt-6 h-12 animate-pulse rounded-2xl bg-gray-100" />

            <div className="mt-4 h-28 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="h-[460px] animate-pulse rounded-[28px] bg-gray-100" />
    </div>
  );
}