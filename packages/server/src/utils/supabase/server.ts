import {createClient} from '@supabase/supabase-js'
import { Database } from '../../database.types'
import dotenv from "dotenv";

dotenv.config({ path: ['.env.local', '.env'] });

export const supabaseClient = () =>
    createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );