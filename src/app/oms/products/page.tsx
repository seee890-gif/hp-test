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
import { deleteProduct } from "./actions";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">製品マスタ</h1>
        <Link href="/oms/products/new">
          <Button>+ 新規登録</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>製品一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <p className="text-center text-gray-500 py-8">製品が登録されていません</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>製品コード</TableHead>
                  <TableHead>製品名</TableHead>
                  <TableHead>単位</TableHead>
                  <TableHead className="text-right">単価</TableHead>
                  <TableHead className="text-right">リードタイム</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono">{product.code}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="text-right">
                      ¥{(product.unit_price || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{product.lead_time_days}日</TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "有効" : "無効"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Link href={`/oms/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">編集</Button>
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
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
