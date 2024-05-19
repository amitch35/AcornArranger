import express, { Request, Response } from "express";
import {supabaseClient} from '../utils/supabase/server';

const router = express.Router();

const supabase = supabaseClient;

const selectRoles = `
    role_id:id, 
    title, 
    description, 
    priority, 
    can_lead_team, 
    can_clean
  `

// Roles
router.get('/', async (req: Request, res: Response) => {
    const {data, error, status} = await supabase
        .from('roles')
        .select(selectRoles)
        .order('priority', { ascending: true })
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

router.get('/:role_id', async (req: Request, res: Response) => {
    const {data, error, status} = await supabase
        .from('roles')
        .select(selectRoles)
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

router.put('/:role_id', async (req: Request, res: Response) => {
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
        let {data, error, status} = await supabase
            .from('roles')
            .select(selectRoles)
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

export default router;