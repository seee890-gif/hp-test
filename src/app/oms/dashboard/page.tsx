import { createClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 統計データを取得
  const [customersResult, productsResult, ordersResult, recentOrdersResult] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact" }),
    supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
    supabase.from("orders").select("id, status, total_amount"),
    supabase.from("orders")
      .select(`
        id,
        order_number,
        status,
        due_date,
        total_amount,
        customers (name)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const customerCount = customersResult.count || 0;
  const productCount = productsResult.count || 0;
  const orders = ordersResult.data || [];
  const recentOrders = recentOrdersResult.data || [];

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inProductionOrders = orders.filter((o) => o.status === "in_production").length;
  const totalSales = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">受付中の受注</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">生産中</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{inProductionOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">顧客数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{customerCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">完了売上</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">¥{totalSales.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* 最近の受注 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>最近の受注</CardTitle>
            <Link href="/oms/orders" className="text-sm text-blue-600 hover:underline">
              すべて表示 →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">受注がありません</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-gray-500">{order.customers?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      ¥{(order.total_amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* クイックリンク */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/oms/orders/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <p className="text-lg font-medium">+ 新規受注作成</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/oms/customers/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <p className="text-lg font-medium">+ 顧客登録</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/oms/products/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <p className="text-lg font-medium">+ 製品登録</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
