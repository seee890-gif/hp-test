import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ProductForm } from "../../product-form";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">製品編集</h1>
      <ProductForm product={product} action={updateProduct} title="製品情報" />
    </div>
  );
}
