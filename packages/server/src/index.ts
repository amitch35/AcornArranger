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
    service:service_key (
      service_id,
      service_name:name
    ),
    status:appointment_status_key (
      status_id,
      status
    )
  `)
  const selectPlans = supabase
  .from('schedule_plans')
  .select(`
    plan_id:id,
    plan_date,
    team,
    appointments:plan_appointments (
      appointment_id,
      sent_to_rc,
      appointment_info:rc_appointments (
        arrival_time, 
        service_time:departure_time, 
        next_arrival_time, 
        turn_around, 
        cancelled_date,
        property:rc_properties (
          properties_id,
          property_name
        ),
        service:service_key (
          service_id,
          service_name:name
        ),
        status:appointment_status_key (
          status_id,
          status
        )
      )
    ),
    staff:plan_staff (
      user_id:staff_id,
      staff_info:rc_staff ( 
        name 
      )
    )
  `)
  .eq('valid', true)
  .filter('plan_appointments.valid', 'eq', true)
  .filter('plan_staff.valid', 'eq', true)

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
        double_unit: (req.body.double_unit[0] && req.body.double_unit.length > 0 ? req.body.double_unit : null)
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

// Plans
app.get('/api/plans', async (req: Request, res: Response) => {
  const per_page = req.query.per_page || 20;
  const page = req.query.page || 0;
  const offset = (per_page * page);

  let query = selectPlans

  if (req.query.from_plan_date)  { query = query.gte('plan_date', req.query.from_plan_date) }
  if (req.query.to_plan_date)  { query = query.lte('plan_date', req.query.to_plan_date) }

  query = query.range(offset, (offset + per_page - 1))
    .order('plan_date', { ascending: false })
    .order('team', { ascending: true })

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

app.get('/api/plans/:plan_id', async (req: Request, res: Response) => {
  let query = selectPlans
  .eq('id', req.params.plan_id)
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

app.post('/api/plans/:plan_id/staff/:user_id', async (req: Request, res: Response) => {
  const { data, error, status } = await supabase
    .rpc(
      'plan_add_staff', 
      {
        staff_to_add: req.params.user_id, 
        target_plan: req.params.plan_id
      }
    )
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
});

app.delete('/api/plans/:plan_id/staff/:user_id', async (req: Request, res: Response) => {
  const { data, error, status } = await supabase
    .rpc(
      'plan_remove_staff', 
      {
        staff_to_remove: req.params.user_id, 
        target_plan: req.params.plan_id
      }
    )
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
});

app.post('/api/plans/:plan_id/appointment/:appointment_id', async (req: Request, res: Response) => {
  const { data, error, status } = await supabase
    .rpc(
      'plan_add_appointment', 
      {
        appointment_to_add: req.params.user_id, 
        target_plan: req.params.plan_id
      }
    )
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
});

app.delete('/api/plans/:plan_id/appointment/:appointment_id', async (req: Request, res: Response) => {
  const { data, error, status } = await supabase
    .rpc(
      'plan_remove_appointment', 
      {
        appointment_to_remove: req.params.user_id, 
        target_plan: req.params.plan_id
      }
    )
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
});

app.post('/api/plans/build/:plan_date', async (req: Request, res: Response) => {
  const { data, error, status } = await supabase
    .rpc(
      'build_schedule_plan', 
      {
        date_to_schedule: req.params.plan_date,
        available_staff: req.body.available_staff,
        office_location: req.body.office_location || `0101000020E6100000D2DB44D213E95DC01D12088552AC4240`,
        services: req.body.services || [21942, 23044],
        omissions: req.body.omissions || null,
        routing_type: req.body.routing_type,
        cleaning_window: req.body.cleaning_window,
        max_hours: req.body.max_hours,
        target_staff_count: req.body.target_staff_count
      }
    )
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
});

app.post('/api/plans/send/:plan_date', async (req: Request, res: Response) => {
  const { data, error, status } = await supabase
    .rpc(
      'send_rc_schedule_plans', 
      {
        schedule_date: req.params.plan_date
      }
    )
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});