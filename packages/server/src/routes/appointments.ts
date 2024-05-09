import express, { Request, Response } from "express";
import {supabaseClient} from '../utils/supabase/server';

const router = express.Router();

const supabase = supabaseClient();

const selectAppointments = `
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
  `

// Appointments
router.get('/', async (req: Request, res: Response) => {
    const per_page = req.query.per_page || 50;
    const page = req.query.page || 0;
    const offset = (per_page * page);
  
    let query = supabase
        .from('rc_appointments')
        .select(selectAppointments)
  
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
  
router.get('/:appointment_id', async (req: Request, res: Response) => {
    let query = supabase
        .from('rc_appointments')
        .select(selectAppointments)
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

export default router;