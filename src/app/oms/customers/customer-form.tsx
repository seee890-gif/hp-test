"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type Customer = {
  id?: number;
  name: string;
  code: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  credit_limit: number;
  notes: string | null;
};

type Props = {
  customer?: Customer;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  title: string;
};

export function CustomerForm({ customer, action, title }: Props) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {customer?.id && <input type="hidden" name="id" value={customer.id} />}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">顧客名 *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={customer?.name || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">顧客コード</Label>
              <Input
                id="code"
                name="code"
                placeholder="C001"
                defaultValue={customer?.code || ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">担当者名</Label>
              <Input
                id="contact_person"
                name="contact_person"
                defaultValue={customer?.contact_person || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={customer?.phone || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={customer?.email || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">住所</Label>
            <Input
              id="address"
              name="address"
              defaultValue={customer?.address || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credit_limit">与信限度額</Label>
            <Input
              id="credit_limit"
              name="credit_limit"
              type="number"
              min="0"
              defaultValue={customer?.credit_limit || 0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">備考</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={customer?.notes || ""}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit">保存</Button>
            <Link href="/oms/customers">
              <Button type="button" variant="outline">キャンセル</Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
