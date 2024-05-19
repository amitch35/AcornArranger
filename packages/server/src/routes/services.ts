import express, { Request, Response } from "express";
import {supabaseClient} from '../utils/supabase/server';

const router = express.Router();

const supabase = supabaseClient;

const selectServices = `
    service_id, 
    name
  `

// Services
router.get('/', async (req: Request, res: Response) => {
    const {data, error, status} = await supabase
        .from('service_key')
        .select(selectServices)
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

export default router;