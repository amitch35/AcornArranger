import { createBrowserClient } from "@supabase/ssr";
// import { Database } from '../../database.types'

export const createClient = () =>
  createBrowserClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );