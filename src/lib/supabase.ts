import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url?.startsWith("https://") && key && key.length > 20);

export const supabase: SupabaseClient = isConfigured
  ? createClient(url!, key!)
  : (null as unknown as SupabaseClient);
