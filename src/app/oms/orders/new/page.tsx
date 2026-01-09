"use client";

import { useState, useEffect } from "react";
import { createOrder } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { supabase, isConfigured } from "@/lib/supabase";

type Customer = { id: number; name: string; code: string | null };
type Product = { id: number; name: string; code: string; unit_price: number; unit: string };
type OrderItem = {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
};

export default function NewOrderPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!isConfigured) return;

      const [customersRes, productsRes] = await Promise.all([
        supabase.from("customers").select("id, name, code").order("name"),
        supabase.from("products").select("id, name, code, unit_price, unit").eq("is_active", true).order("name"),
      ]);

      setCustomers(customersRes.data || []);
      setProducts(productsRes.data || []);
    }
    loadData();
  }, []);

  const addItem = () => {
    const product = products.find((p) => p.id === Number(selectedProduct));
    if (!product || quantity <= 0) return;

    const existingIndex = items.findIndex((i) => i.product_id === product.id);
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += quantity;
      newItems[existingIndex].amount = newItems[existingIndex].quantity * newItems[existingIndex].unit_price;
      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          product_id: product.id,
          product_name: product.name,
          quantity,
          unit_price: product.unit_price,
          amount: quantity * product.unit_price,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = Math.floor(total * 0.1);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.set("items", JSON.stringify(items.map(({ product_id, quantity, unit_price, amount }) => ({
      product_id, quantity, unit_price, amount,
    }))));
    await createOrder(formData);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">新規受注</h1>

      <form action={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_id">顧客 *</Label>
                <Select name="customer_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="顧客を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.code ? `[${c.code}] ` : ""}{c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order_date">受注日 *</Label>
                  <Input
                    id="order_date"
                    name="order_date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">納期</Label>
                  <Input id="due_date" name="due_date" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">備考</Label>
                <Textarea id="notes" name="notes" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* 明細 */}
          <Card>
            <CardHeader>
              <CardTitle>明細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="製品を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        [{p.code}] {p.name} - ¥{p.unit_price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20"
                />
                <Button type="button" onClick={addItem}>追加</Button>
              </div>

              {items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>製品</TableHead>
                      <TableHead className="text-right">数量</TableHead>
                      <TableHead className="text-right">単価</TableHead>
                      <TableHead className="text-right">金額</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">¥{item.unit_price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">¥{item.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            ×
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-4">明細を追加してください</p>
              )}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>¥{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>消費税 (10%)</span>
                  <span>¥{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>合計</span>
                  <span>¥{(total + tax).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={loading || items.length === 0}>
            {loading ? "保存中..." : "受注を登録"}
          </Button>
          <Link href="/oms/orders">
            <Button type="button" variant="outline">キャンセル</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
