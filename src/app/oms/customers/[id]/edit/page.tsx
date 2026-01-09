import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { CustomerForm } from "../../customer-form";
import { updateCustomer } from "../../actions";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">顧客編集</h1>
      <CustomerForm customer={customer} action={updateCustomer} title="顧客情報" />
    </div>
  );
}
