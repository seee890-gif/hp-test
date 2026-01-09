"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type OrderItem = {
  product_id: number;
  quantity: number;
  unit_price: number;
  amount: number;
};

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const itemsJson = formData.get("items") as string;
  const items: OrderItem[] = JSON.parse(itemsJson || "[]");

  const total_amount = items.reduce((sum, item) => sum + item.amount, 0);
  const tax_amount = Math.floor(total_amount * 0.1);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: Number(formData.get("customer_id")),
      status: "pending",
      order_date: formData.get("order_date") as string,
      due_date: formData.get("due_date") as string || null,
      total_amount,
      tax_amount,
      notes: formData.get("notes") as string || null,
      created_by: user?.id,
    })
    .select()
    .single();

  if (orderError) {
    return { error: orderError.message };
  }

  if (items.length > 0) {
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      amount: item.amount,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return { error: itemsError.message };
    }
  }

  revalidatePath("/oms/orders");
  redirect("/oms/orders");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase.from("orders").update({ status }).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/oms/orders");
  revalidatePath(`/oms/orders/${id}`);
}

export async function deleteOrder(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/oms/orders");
}
