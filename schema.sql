-- Supabaseで実行してください
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON news FOR SELECT USING (true);
