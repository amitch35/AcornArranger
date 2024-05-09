import express, { Request, Response } from "express";
import {supabaseClient} from '../utils/supabase/server';

require('dotenv').config({ path: ['.env.local', '.env'] });

const router = express.Router();

const supabase = supabaseClient();

const selectProperties = `
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
`

// Properties
router.get('/', async (req: Request, res: Response) => {
  const {data, error, status} = await supabase
    .from('rc_properties')
    .select(selectProperties)
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

router.get('/:property_id', async (req: Request, res: Response) => {
  const {data, error, status} = await supabase
    .from('rc_properties')
    .select(selectProperties)
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

router.put('/:property_id', async (req: Request, res: Response) => {
  let { error, status } = await supabase
    .from('rc_properties')
    .update({
        estimated_cleaning_mins: req.body.estimated_cleaning_mins,
        double_unit: (req.body.double_unit && req.body.double_unit[0] && req.body.double_unit.length > 0 ? req.body.double_unit : null)
     })
    .eq('properties_id', req.params.property_id)
  
  if (error) {
    res.status(status);
    res.send(error);
  } else {
    let {data, error, status} = await supabase
      .from('rc_properties')
      .select(selectProperties)
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

export default router;