import express, { Request, Response } from "express";
import {supabaseClient} from '../utils/supabase/server';

const router = express.Router();

const supabase = supabaseClient();

const selectPlans = `
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
  `

// Plans
router.get('/', async (req: Request, res: Response) => {
    const per_page = req.query.per_page || 20;
    const page = req.query.page || 0;
    const offset = (per_page * page);
  
    let query = supabase
        .from('schedule_plans')
        .select(selectPlans)
        .eq('valid', true)
        .filter('plan_appointments.valid', 'eq', true)
        .filter('plan_staff.valid', 'eq', true)
  
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
  
router.get('/:plan_id', async (req: Request, res: Response) => {
    let query = supabase
        .from('schedule_plans')
        .select(selectPlans)
        .eq('valid', true)
        .filter('plan_appointments.valid', 'eq', true)
        .filter('plan_staff.valid', 'eq', true)
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
  
router.post('/:plan_id/staff/:user_id', async (req: Request, res: Response) => {
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
  
router.delete('/:plan_id/staff/:user_id', async (req: Request, res: Response) => {
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
  
router.post('/:plan_id/appointment/:appointment_id', async (req: Request, res: Response) => {
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
  
router.delete('/:plan_id/appointment/:appointment_id', async (req: Request, res: Response) => {
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
  
router.post('/build/:plan_date', async (req: Request, res: Response) => {
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
  
router.post('/send/:plan_date', async (req: Request, res: Response) => {
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

export default router;