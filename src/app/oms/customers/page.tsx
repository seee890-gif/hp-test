import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCustomer } from "./actions";

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">顧客マスタ</h1>
        <Link href="/oms/customers/new">
          <Button>+ 新規登録</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>顧客一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {!customers || customers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">顧客が登録されていません</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>顧客コード</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>担当者</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>メール</TableHead>
                  <TableHead className="text-right">与信限度</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-mono">{customer.code || "-"}</TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.contact_person || "-"}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell className="text-right">
                      ¥{(customer.credit_limit || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Link href={`/oms/customers/${customer.id}/edit`}>
                          <Button variant="outline" size="sm">編集</Button>
                        </Link>
                        <form action={deleteCustomer}>
                          <input type="hidden" name="id" value={customer.id} />
                          <Button variant="destructive" size="sm" type="submit">
                            削除
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
