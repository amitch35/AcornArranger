import express, { Request, Response } from "express";
import {createClient} from '@supabase/supabase-js'
import { Database } from '../database.types'
// import {createClient} from '@/utils/supabase/server'

require('dotenv').config({ path: ['.env.local', '.env'] });

const app = express();
const port = process.env.PORT || 4000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.use(express.json());

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

app.get('/api/properties', async (req, res) => {
  const {data, error} = await supabase
    .from('rc_properties')
    .select(`
      properties_id,
      property_name,
      address:rc_addresses (
        address, city, state_name, postal_code, country
      ),
      status_id,
      estimated_cleaning_mins,
      double_unit
    `)
  if (error) {
    res.send(error);
  }
  res.send(data);
});

app.get('/api/properties/:propertyId', async (req: Request, res: Response) => {
  const {data, error} = await supabase
    .from('rc_properties')
    .select(`
      properties_id,
      property_name,
      address:rc_addresses (
        address, city, state_name, postal_code, country
      ),
      status_id,
      estimated_cleaning_mins,
      double_unit
    `)
    .eq('properties_id', req.params.propertyId)
  if (error) {
    res.send(error);
  }
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});