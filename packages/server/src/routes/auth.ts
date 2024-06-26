import express, { NextFunction, Request, Response } from "express";
import { supabaseClient } from "../utils/supabase/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TokenJSON } from "@/models";

dotenv.config({ path: ['.env.local', '.env'] });

const TOKEN_SECRET = process.env.SUPABASE_JWT_SECRET || "NOT_A_SECRET";

const router = express.Router();

const supabase = supabaseClient;

// Auth
router.post('/signup', async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({'error': 'Bad request: Invalid input data. Make sure you provide an email and password'});
  } else {
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
      // supabase.auth.signOut() // persistSession setting doesn't work so signout immediately
      res.send(data);
    }
  }
});

router.post('/login', async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({'error': 'Bad request: Invalid input data. Make sure you provide an email and password'})
  } else {
    const { data, error } = await supabase.auth.signInWithPassword(
      {
        email: req.body.email,
        password: req.body.password,
      }
    )
    if (error) {
      res.send(error);
    } else {
      // supabase.auth.signOut() // persistSession setting doesn't work so signout immediately
      res.send(data);
    }
  }
});
  
router.get('/user', async (req: Request, res: Response) => {
    const token = getToken(req);
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error) {
        res.send(error);
      } else {
        res.send(user);
      }
    } else {
      res.status(401).json({'error': 'Authorization header not present'})
    }
});

function getToken(req: Request) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } 
  return null;
}

export async function supabaseMiddleware (req: Request, res: Response, next: NextFunction) {
  const token = getToken(req)

  switch(token){
    case null:
      res.status(401).json({'error': 'Authorization header not present'}).end()
      break;
    default:
      jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
        if (error) res.send(error).end()
        else if (decoded) {
          const token_json = decoded as TokenJSON;
          if (token_json.user_role && token_json.user_role === 'authorized_user') {
            next();
          } else {
            res.status(403).json({'error': 'User not Authorized, contact administrator for authorization'}).end()
          }
        }
        else res.status(403).end();
      });
      break;
  }
}

export default router;