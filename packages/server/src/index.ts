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

// Supabase selection query bases
const selectProperties = supabase
  .from('rc_properties')
  .select(`
    properties_id,
    property_name,
    estimated_cleaning_mins,
    double_unit,
    address:rc_addresses (
      address, 
      city, 
      state_name, 
      postal_code, 
      country
    ),
    status:property_status_key (
      status_id,
      status
    )
  `)
const selectStaffBasic = supabase
  .from('rc_staff')
  .select(`
    user_id,
    name,
    first_name,
    last_name,
    role:roles (
      role_id:id, 
      title
    ),
    status:staff_status_key (
      status_id,
      status
    )
  `)
const selectStaffFull = supabase
  .from('rc_staff')
  .select(`
    user_id,
    name,
    first_name,
    last_name,
    role:roles (
      role_id:id, 
      title, 
      description, 
      priority, 
      can_lead_team, 
      can_clean
    ),
    status:staff_status_key (
      status_id,
      status
    )
  `)
const selectRoles = supabase
  .from('roles')
  .select(`
    role_id:id, 
    title, 
    description, 
    priority, 
    can_lead_team, 
    can_clean
  `)
const selectAppointments = supabase
  .from('rc_appointments')
  .select(`
    appointment_id, 
    arrival_time, 
    service_time:departure_time, 
    next_arrival_time, 
    turn_around, 
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
    ),
    status:appointment_status_key (
      status_id,
      status
    )
  `)

// Properties
app.get('/api/properties', async (req, res) => {
  const {data, error, status} = await selectProperties
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

app.get('/api/properties/:property_id', async (req: Request, res: Response) => {
  const {data, error, status} = await selectProperties
    .eq('properties_id', req.params.property_id)
    .maybeSingle()
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

app.put('/api/properties/:property_id', async (req: Request, res: Response) => {
  let { error, status } = await supabase
    .from('rc_properties')
    .update({
        estimated_cleaning_mins: req.body.estimated_cleaning_mins,
        double_unit: req.body.double_unit
     })
    .eq('properties_id', req.params.property_id)
  
  if (error) {
    res.status(status);
    res.send(error);
  } else {
    let {data, error, status} = await selectProperties
      .eq('properties_id', req.params.property_id)
      .maybeSingle()
    res.status(status);
    if (error) {
      res.send(error);
    } else if (data) {
      res.send(data);
    } else {
      res.status(404)
      res.send()
    }
  }
});

// Staff
app.get('/api/staff', async (req: Request, res: Response) => {
  const {data, error, status} = await selectStaffBasic
    .order('status_id', { ascending: true })
    .order('name', { ascending: true })
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

app.get('/api/staff/:user_id', async (req: Request, res: Response) => {
  const {data, error, status} = await selectStaffFull
    .eq('user_id', req.params.user_id)
    .maybeSingle()
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

// Roles
app.get('/api/roles', async (req: Request, res: Response) => {
  const {data, error, status} = await selectRoles
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

app.get('/api/roles/:role_id', async (req: Request, res: Response) => {
  const {data, error, status} = await selectRoles
    .eq('id', req.params.role_id)
    .maybeSingle()
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

app.put('/api/roles/:role_id', async (req: Request, res: Response) => {
  let { error, status } = await supabase
    .from('roles')
    .update({ 
      description: req.body.description,
      priority: req.body.priority,
      can_lead_team: req.body.can_lead_team,
      can_clean: req.body.can_clean
     })
    .eq('id', req.params.role_id)
  
  if (error) {
    res.status(status);
    res.send(error);
  } else {
    let {data, error, status} = await selectRoles
      .eq('id', req.params.role_id)
      .maybeSingle()
    res.status(status);
    if (error) {
      res.send(error);
    } else if (data) {
      res.send(data);
    } else {
      res.status(404)
      res.send()
    }
  }
});

// Appointments
app.get('/api/appointments', async (req: Request, res: Response) => {
  const per_page = req.query.per_page || 50;
  const page = req.query.page || 0;
  const offset = (per_page * page);

  let query = selectAppointments

  if (req.query.from_service_date)  { query = query.gte('departure_time', req.query.from_service_date) }
  if (req.query.to_service_date)  { query = query.lte('departure_time', `${req.query.to_service_date}  23:59:59+00`) }

  query = query.range(offset, (offset + per_page - 1))
    .order('departure_time', { ascending: false })
    .order('property_name', { referencedTable: 'rc_properties', ascending: true })
    .order('appointment_id', { ascending: true })

  const {data, error, status} = await query
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

app.get('/api/appointments/:appointment_id', async (req: Request, res: Response) => {
  let query = selectAppointments
  .eq('appointment_id', req.params.appointment_id)
  .maybeSingle()

  const {data, error, status} = await query
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

app.post('/api/plans/:plan_id/staff/:user_id/add', async (req: Request, res: Response) => {
  
  const { data, error, status } = await supabase
    .rpc(
      'team_plan_add_staff', 
      {
        staff_to_add: req.params.user_id, 
        target_plan: req.params.plan_id
      }
    )
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404)
    res.send()
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});