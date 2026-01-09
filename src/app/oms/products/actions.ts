"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    description: formData.get("description") as string || null,
    unit: formData.get("unit") as string || "個",
    unit_price: Number(formData.get("unit_price")) || 0,
    lead_time_days: Number(formData.get("lead_time_days")) || 7,
    is_active: formData.get("is_active") === "on",
  };

  const { error } = await supabase.from("products").insert(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/oms/products");
  redirect("/oms/products");
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const data = {
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    description: formData.get("description") as string || null,
    unit: formData.get("unit") as string || "個",
    unit_price: Number(formData.get("unit_price")) || 0,
    lead_time_days: Number(formData.get("lead_time_days")) || 7,
    is_active: formData.get("is_active") === "on",
  };

  const { error } = await supabase.from("products").update(data).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/oms/products");
  redirect("/oms/products");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/oms/products");
}
