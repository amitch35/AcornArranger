import express, { Request, Response } from "express";
import {createClient} from '@supabase/supabase-js'
import { Database } from './database.types'
// import {createClient} from '@/utils/supabase/server'

require('dotenv').config({ path: ['.env.local', '.env'] });

const { queryParser } = require('express-query-parser')
const app = express();
const port = process.env.PORT || 4000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.use(express.json());

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  })
)

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Properties
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

app.get('/api/properties/:property_id', async (req: Request, res: Response) => {
  const {data, error} = await supabase
    .from('rc_properties')
    .select(`
      properties_id,
      property_name,
      address:rc_addresses (
        address, 
        city, 
        state_name, 
        postal_code, 
        country
      ),
      status_id,
      estimated_cleaning_mins,
      double_unit
    `)
    .eq('properties_id', req.params.property_id)
  if (error) {
    res.send(error);
  }
  res.send(data);
});

// Staff
app.get('/api/staff', async (req: Request, res: Response) => {
  const {data, error} = await supabase
    .from('rc_staff')
    .select(`
      user_id,
      name,
      role:roles (
        role_id:id, 
        title
      ),
      status_id,
      first_name,
      last_name
    `)
  if (error) {
    res.send(error);
  }
  res.send(data);
});

app.get('/api/staff/:user_id', async (req: Request, res: Response) => {
  const {data, error} = await supabase
    .from('rc_staff')
    .select(`
      user_id,
      name,
      role:roles (
        role_id:id, 
        title, 
        description, 
        priority, 
        can_lead_team, 
        can_clean
      ),
      status_id,
      first_name,
      last_name
    `)
    .eq('user_id', req.params.user_id)
  if (error) {
    res.send(error);
  }
  res.send(data);
});

// Roles
app.get('/api/roles', async (req: Request, res: Response) => {
  const {data, error} = await supabase
    .from('roles')
    .select(`
      role_id:id, 
      title, 
      description, 
      priority, 
      can_lead_team, 
      can_clean
    `)
  if (error) {
    res.send(error);
  }
  res.send(data);
});

app.get('/api/roles/:role_id', async (req: Request, res: Response) => {
  const {data, error} = await supabase
    .from('roles')
    .select(`
      role_id:id, 
      title, 
      description, 
      priority, 
      can_lead_team, 
      can_clean
    `)
    .eq('id', req.params.role_id)
  if (error) {
    res.send(error);
  }
  res.send(data);
});

// Appointments
app.get('/api/appointments', async (req: Request, res: Response) => {
  const per_page = req.query.per_page || 50;
  const page = req.query.page || 0;
  const offset = (per_page * page);

  let query = supabase
  .from('rc_appointments')
  .select(`
    appointment_id, 
    arrival_time, 
    service_time:departure_time, 
    next_arrival_time, 
    turn_around, 
    app_status_id,
    cancelled_date,
    service,
    property:rc_properties (
      properties_id,
      property_name
    ),
    staff:appointments_staff (
      user_id:staff_id,
      staff_info:rc_staff ( 
        name 
      )
    )
  `)

  if (req.query.from_service_date)  { query = query.gte('departure_time', req.query.from_service_date) }
  if (req.query.to_service_date)  { query = query.lte('departure_time', `${req.query.to_service_date}  23:59:59+00`) }

  query = query.range(offset, (offset + per_page - 1))
    .order('departure_time', { ascending: false })
    .order('property_name', { referencedTable: 'rc_properties', ascending: true })
    .order('appointment_id', { ascending: true })

  const {data, error} = await query

  if (error) {
    res.send(error);
  }
  res.send(data);
});

app.get('/api/appointments/:appointment_id', async (req: Request, res: Response) => {
  let query = supabase
  .from('rc_appointments')
  .select(`
    appointment_id, 
    arrival_time, 
    service_time:departure_time, 
    next_arrival_time, 
    turn_around, 
    app_status_id,
    cancelled_date,
    service,
    property:rc_properties (
      properties_id,
      property_name
    ),
    staff:appointments_staff (
      user_id:staff_id,
      staff_info:rc_staff ( 
        name 
      )
    )
  `)
  .eq('appointment_id', req.params.appointment_id)

  const {data, error} = await query

  if (error) {
    res.send(error);
  }
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});