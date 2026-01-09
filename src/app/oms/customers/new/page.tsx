import { CustomerForm } from "../customer-form";
import { createCustomer } from "../actions";

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">顧客登録</h1>
      <CustomerForm action={createCustomer} title="新規顧客" />
    </div>
  );
}
