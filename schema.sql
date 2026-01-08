-- Supabaseで実行してください
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON news FOR SELECT USING (true);
CREATE POLICY "public insert" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON news FOR UPDATE USING (true);
CREATE POLICY "public delete" ON news FOR DELETE USING (true);

-- YouTube動画テーブル
CREATE TABLE youtube_videos (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read youtube" ON youtube_videos FOR SELECT USING (true);
CREATE POLICY "public insert youtube" ON youtube_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "public update youtube" ON youtube_videos FOR UPDATE USING (true);
CREATE POLICY "public delete youtube" ON youtube_videos FOR DELETE USING (true);
