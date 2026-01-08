"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

const YOUTUBE_HANDLE = "mimo_claudecode";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
}

// YouTube関連
export async function refreshYouTube() {
  try {
    const channelRes = await fetch(`https://www.youtube.com/@${YOUTUBE_HANDLE}`, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });
    const html = await channelRes.text();

    const channelIdMatch =
      html.match(/"channelId":"(UC[a-zA-Z0-9_-]+)"/) ||
      html.match(/channel_id=(UC[a-zA-Z0-9_-]+)/) ||
      html.match(/"externalId":"(UC[a-zA-Z0-9_-]+)"/);

    if (!channelIdMatch) {
      return { success: false, error: "チャンネルIDが見つかりませんでした" };
    }

    const channelId = channelIdMatch[1];
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(rssUrl, { cache: "no-store" });
    const xml = await response.text();

    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

    for (const entry of entries.slice(0, 6)) {
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch =
        entry.match(/<media:title>([^<]+)<\/media:title>/) ||
        entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

      if (videoIdMatch && titleMatch) {
        const video_id = videoIdMatch[1];
        const title = titleMatch[1];
        const thumbnail_url = `https://img.youtube.com/vi/${video_id}/mqdefault.jpg`;
        const published_at = publishedMatch ? publishedMatch[1] : null;

        await supabase
          .from("youtube_videos")
          .upsert({ video_id, title, thumbnail_url, published_at }, { onConflict: "video_id" });
      }
    }

    revalidateAll();
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addYouTubeVideo(formData: FormData) {
  const url = formData.get("url") as string;
  const title = formData.get("title") as string;

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (!match) return;

  const video_id = match[1];
  const thumbnail_url = `https://img.youtube.com/vi/${video_id}/mqdefault.jpg`;

  await supabase.from("youtube_videos").upsert(
    { video_id, title, thumbnail_url, published_at: new Date().toISOString() },
    { onConflict: "video_id" }
  );

  revalidateAll();
}

export async function deleteYouTubeVideo(formData: FormData) {
  const id = formData.get("id") as string;
  await supabase.from("youtube_videos").delete().eq("id", id);
  revalidateAll();
}

// お知らせ関連
export async function createNews(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  await supabase.from("news").insert({ title, content });
  revalidateAll();
}

export async function updateNews(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  await supabase.from("news").update({ title, content }).eq("id", id);
  revalidateAll();
}

export async function deleteNews(formData: FormData) {
  const id = formData.get("id") as string;
  await supabase.from("news").delete().eq("id", id);
  revalidateAll();
}
