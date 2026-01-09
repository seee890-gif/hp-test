import { ProductForm } from "../product-form";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">製品登録</h1>
      <ProductForm action={createProduct} title="新規製品" />
    </div>
  );
}
