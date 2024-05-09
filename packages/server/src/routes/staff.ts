import express, { Request, Response } from "express";
import {supabaseClient} from '../utils/supabase/server';

const router = express.Router();

const supabase = supabaseClient();

const selectStaffBasic = `
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
  `
const selectStaffFull = `
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
  `

// Staff
router.get('/', async (req: Request, res: Response) => {
    const {data, error, status} = await supabase
        .from('rc_staff')
        .select(selectStaffBasic)
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

router.get('/:user_id', async (req: Request, res: Response) => {
    const {data, error, status} = await supabase
        .from('rc_staff')
        .select(selectStaffFull)
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


export default router;