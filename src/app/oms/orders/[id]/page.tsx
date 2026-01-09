import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
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
import { updateOrderStatus } from "../actions";

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

const statusFlow = ["pending", "confirmed", "in_production", "ready_to_ship", "shipped", "completed"];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      customers (name, contact_person, email, phone),
      order_items (
        id,
        quantity,
        unit_price,
        amount,
        products (name, code)
      )
    `)
    .eq("id", id)
    .single();

  if (!order) {
    notFound();
  }

  const currentStatusIndex = statusFlow.indexOf(order.status);
  const nextStatus = currentStatusIndex < statusFlow.length - 1 ? statusFlow[currentStatusIndex + 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <Badge className={statusColors[order.status]}>
            {statusLabels[order.status]}
          </Badge>
        </div>
        <div className="flex gap-2">
          {nextStatus && order.status !== "cancelled" && (
            <form action={updateOrderStatus}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="status" value={nextStatus} />
              <Button type="submit">
                {statusLabels[nextStatus]}に進める
              </Button>
            </form>
          )}
          {order.status !== "cancelled" && order.status !== "completed" && (
            <form action={updateOrderStatus}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="status" value="cancelled" />
              <Button type="submit" variant="destructive">
                キャンセル
              </Button>
            </form>
          )}
          <Link href="/oms/orders">
            <Button variant="outline">一覧に戻る</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">受注日</p>
                <p className="font-medium">{order.order_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">納期</p>
                <p className="font-medium">{order.due_date || "-"}</p>
              </div>
            </div>
            {order.notes && (
              <div>
                <p className="text-sm text-gray-500">備考</p>
                <p>{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 顧客情報 */}
        <Card>
          <CardHeader>
            <CardTitle>顧客情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium text-lg">{order.customers?.name}</p>
            {order.customers?.contact_person && (
              <p className="text-gray-600">担当: {order.customers.contact_person}</p>
            )}
            {order.customers?.phone && (
              <p className="text-gray-600">TEL: {order.customers.phone}</p>
            )}
            {order.customers?.email && (
              <p className="text-gray-600">Email: {order.customers.email}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 明細 */}
      <Card>
        <CardHeader>
          <CardTitle>明細</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>製品コード</TableHead>
                <TableHead>製品名</TableHead>
                <TableHead className="text-right">数量</TableHead>
                <TableHead className="text-right">単価</TableHead>
                <TableHead className="text-right">金額</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.products?.code}</TableCell>
                  <TableCell>{item.products?.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">¥{item.unit_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">¥{item.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="border-t mt-4 pt-4 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>小計</span>
              <span>¥{(order.total_amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>消費税 (10%)</span>
              <span>¥{(order.tax_amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>合計</span>
              <span>¥{((order.total_amount || 0) + (order.tax_amount || 0)).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
