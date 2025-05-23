import express, { Request, Response } from "express";
import {supabaseClient} from '../utils/supabase/server';

const router = express.Router();

const supabase = supabaseClient;

const selectAppointments = `
    appointment_id, 
    arrival_time, 
    service_time:departure_time, 
    next_arrival_time, 
    turn_around, 
    cancelled_date,
    property_info:rc_properties (
      properties_id,
      property_name
    ),
    staff:appointments_staff (
      user_id:staff_id,
      staff_info:rc_staff ( 
        user_id,
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

    var filter_status_ids: Array<number> = [1,2,3,4];

    var filter_service_ids: Array<number> = [];

    if (req.query.filter_status_id) {
      // Convert query parameters to a number array
      const filterStatusIdsStringArray = Array.isArray(req.query.filter_status_id)
          ? req.query.filter_status_id
          : [req.query.filter_status_id];

      // Convert each element to a number
      filter_status_ids = filterStatusIdsStringArray.map(id => Number(id)).filter(id => !isNaN(id));
    }

    if (req.query.filter_service_id) {
      // Convert query parameters to a number array
      const filterServiceIdsStringArray = Array.isArray(req.query.filter_service_id)
          ? req.query.filter_service_id
          : [req.query.filter_service_id];

      // Convert each element to a number
      filter_service_ids = filterServiceIdsStringArray.map(id => Number(id)).filter(id => !isNaN(id));
    }
  
    let query = supabase
        .from('rc_appointments')
        .select(selectAppointments)
  
    if (req.query.from_service_date)  { query = query.gte('departure_time', req.query.from_service_date) }
    if (req.query.to_service_date)  { query = query.lte('departure_time', `${req.query.to_service_date}  23:59:59+00`) }

    if (filter_service_ids.length !== 0) { query = query.in('service', filter_service_ids) }

    if (req.query.show_unscheduled) { query = query.is('staff', null)} // Show only appointments with no staff 
  
    query = query.in('app_status_id', filter_status_ids)
      .range(offset, (offset + per_page - 1))
      .order('departure_time', { ascending: true })
      .order('next_arrival_time', { ascending: true })
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