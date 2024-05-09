import express, { Request, Response } from "express";
import {createClient} from '@supabase/supabase-js'
import { Database } from '../database.types'

const router = express.Router();

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Auth
router.post('/signup', async (req: Request, res: Response) => {
    const { data, error } = await supabase.auth.signUp(
      {
        email: req.body.email,
        password: req.body.password,
        options: {
          data: {
            display_name: req.body.first_name + ' ' + req.body.last_name,
            first_name: req.body.first_name,
            last_name: req.body.last_name
          },
          emailRedirectTo: '/'
        }
      }
    )
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const supabase_login_client = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase_login_client.auth.signInWithPassword(
      {
        email: req.body.email,
        password: req.body.password,
      }
    )
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
});
  
router.post('/logout', async (req: Request, res: Response) => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      res.send(error);
    } else {
      res.send();
    }
});
  
router.get('/user', async (req: Request, res: Response) => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      res.send(error);
    } else {
      res.send(user);
    }
});
  
router.put('/user', async (req: Request, res: Response) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        display_name: req.body.first_name + ' ' + req.body.last_name,
        first_name: req.body.first_name,
        last_name: req.body.last_name
      }
    })
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
});

export default router;