import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, updateOrderStatus } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusLabels: Record<string, string> = {
  pending: "受付",
  confirmed: "確定",
  in_production: "生産中",
  ready_to_ship: "出荷待ち",
  shipped: "出荷済",
  completed: "完了",
  cancelled: "キャンセル",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_production: "bg-purple-100 text-purple-800",
  ready_to_ship: "bg-orange-100 text-orange-800",
  shipped: "bg-cyan-100 text-cyan-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      customers (name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">受注管理</h1>
        <Link href="/oms/orders/new">
          <Button>+ 新規受注</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>受注一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">受注がありません</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>受注番号</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>受注日</TableHead>
                  <TableHead>納期</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">
                      <Link href={`/oms/orders/${order.id}`} className="text-blue-600 hover:underline">
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customers?.name}</TableCell>
                    <TableCell>{order.order_date}</TableCell>
                    <TableCell>{order.due_date || "-"}</TableCell>
                    <TableCell className="text-right">
                      ¥{((order.total_amount || 0) + (order.tax_amount || 0)).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Link href={`/oms/orders/${order.id}`}>
                          <Button variant="outline" size="sm">詳細</Button>
                        </Link>
                        <form action={deleteOrder}>
                          <input type="hidden" name="id" value={order.id} />
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
