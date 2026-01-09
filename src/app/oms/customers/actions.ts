"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCustomer(formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    code: formData.get("code") as string || null,
    contact_person: formData.get("contact_person") as string || null,
    email: formData.get("email") as string || null,
    phone: formData.get("phone") as string || null,
    address: formData.get("address") as string || null,
    credit_limit: Number(formData.get("credit_limit")) || 0,
    notes: formData.get("notes") as string || null,
  };

  const { error } = await supabase.from("customers").insert(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/oms/customers");
  redirect("/oms/customers");
}

export async function updateCustomer(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const data = {
    name: formData.get("name") as string,
    code: formData.get("code") as string || null,
    contact_person: formData.get("contact_person") as string || null,
    email: formData.get("email") as string || null,
    phone: formData.get("phone") as string || null,
    address: formData.get("address") as string || null,
    credit_limit: Number(formData.get("credit_limit")) || 0,
    notes: formData.get("notes") as string || null,
  };

  const { error } = await supabase.from("customers").update(data).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/oms/customers");
  redirect("/oms/customers");
}

export async function deleteCustomer(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/oms/customers");
}
