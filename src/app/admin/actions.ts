"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createNews(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await supabase.from("news").insert({ title, content });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateNews(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await supabase.from("news").update({ title, content }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteNews(formData: FormData) {
  const id = formData.get("id") as string;

  await supabase.from("news").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
}
