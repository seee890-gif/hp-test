import { supabase, isConfigured } from "@/lib/supabase";
import Link from "next/link";

type News = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export const revalidate = 0;

export default async function Home() {
  let news: News[] = [];

  if (isConfigured) {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    news = data || [];
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">お知らせ</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            管理画面 →
          </Link>
        </div>

        {news.length === 0 ? (
          <p className="text-gray-500">お知らせはありません</p>
        ) : (
          <ul className="space-y-4">
            {news.map((item) => (
              <li key={item.id} className="bg-white p-6 rounded-lg shadow">
                <time className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString("ja-JP")}
                </time>
                <h2 className="text-xl font-semibold mt-1">{item.title}</h2>
                <p className="text-gray-600 mt-2">{item.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
