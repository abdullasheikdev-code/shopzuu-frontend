import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Add New Product
      </h1>
      <ProductForm />
    </div>
  );
}