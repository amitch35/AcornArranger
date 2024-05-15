import {createClient} from '@supabase/supabase-js'
import { Database } from '../../database.types'
import dotenv from "dotenv";

dotenv.config({ path: ['.env.local', '.env'] });

const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    );

supabase.auth.signInWithPassword(
  {
    email: process.env.SUPABASE_SERVER_ACCT_EMAIL!,
    password: process.env.SUPABASE_SERVER_ACCT_PSWD!,
  }
);

export const supabaseClient = supabase;