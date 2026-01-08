import { supabase, isConfigured } from "@/lib/supabase";
import { News, YouTubeVideo } from "@/lib/types";
import Link from "next/link";

export const revalidate = 0;

export default async function Home() {
  let news: News[] = [];
  let videos: YouTubeVideo[] = [];

  if (isConfigured) {
    const [newsResult, videosResult] = await Promise.all([
      supabase.from("news").select("*").order("created_at", { ascending: false }),
      supabase.from("youtube_videos").select("*").order("published_at", { ascending: false }).limit(6),
    ]);
    news = newsResult.data || [];
    videos = videosResult.data || [];
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
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

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">YouTube動画</h2>
          {videos.length === 0 ? (
            <p className="text-gray-500">動画はありません</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
