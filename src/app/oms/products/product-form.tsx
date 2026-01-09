"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type Product = {
  id?: number;
  name: string;
  code: string;
  description: string | null;
  unit: string;
  unit_price: number;
  lead_time_days: number;
  is_active: boolean;
};

type Props = {
  product?: Product;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  title: string;
};

export function ProductForm({ product, action, title }: Props) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {product?.id && <input type="hidden" name="id" value={product.id} />}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">製品名 *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={product?.name || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">製品コード *</Label>
              <Input
                id="code"
                name="code"
                required
                placeholder="PRD-001"
                defaultValue={product?.code || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product?.description || ""}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">単位</Label>
              <Input
                id="unit"
                name="unit"
                defaultValue={product?.unit || "個"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_price">単価 (円)</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                min="0"
                defaultValue={product?.unit_price || 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_time_days">リードタイム (日)</Label>
              <Input
                id="lead_time_days"
                name="lead_time_days"
                type="number"
                min="0"
                defaultValue={product?.lead_time_days || 7}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              defaultChecked={product?.is_active ?? true}
              className="h-4 w-4"
            />
            <Label htmlFor="is_active">有効</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit">保存</Button>
            <Link href="/oms/products">
              <Button type="button" variant="outline">キャンセル</Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
