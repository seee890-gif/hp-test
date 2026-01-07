import { supabase, isConfigured } from "@/lib/supabase";
import { createNews, updateNews, deleteNews } from "./actions";
import Link from "next/link";

type News = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export const revalidate = 0;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  let news: News[] = [];
  let editingNews: News | null = null;

  if (isConfigured) {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    news = data || [];

    if (edit) {
      editingNews = news.find((n) => n.id === Number(edit)) || null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">管理画面</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← サイトに戻る
          </Link>
        </div>

        {/* 新規作成 / 編集フォーム */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingNews ? "お知らせを編集" : "新規お知らせ"}
          </h2>
          <form action={editingNews ? updateNews : createNews}>
            {editingNews && (
              <input type="hidden" name="id" value={editingNews.id} />
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">タイトル</label>
              <input
                type="text"
                name="title"
                defaultValue={editingNews?.title || ""}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">内容</label>
              <textarea
                name="content"
                defaultValue={editingNews?.content || ""}
                required
                rows={4}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingNews ? "更新" : "追加"}
              </button>
              {editingNews && (
                <Link
                  href="/admin"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  キャンセル
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* お知らせ一覧 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">お知らせ一覧</h2>
          {news.length === 0 ? (
            <p className="text-gray-500">お知らせはありません</p>
          ) : (
            <ul className="space-y-4">
              {news.map((item) => (
                <li
                  key={item.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <time className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString("ja-JP")}
                      </time>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.content}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/admin?edit=${item.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        編集
                      </Link>
                      <form action={deleteNews}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:underline text-sm"
                        >
                          削除
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
