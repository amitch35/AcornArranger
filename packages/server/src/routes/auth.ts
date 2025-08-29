import express, { NextFunction, Request, Response } from "express";
import { supabaseClient } from "../utils/supabase/client";
// import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { TokenJSON } from "@/models";
// import { JwtPayload } from "@supabase/supabase-js";

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
      const { data, error } = await supabase.auth.getClaims(token)
      if (error || !data?.claims) {
        res.send(error);
      } else {
        res.send(data.claims);
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

export async function supabaseMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ error: "Authorization header not present" }).end();
  }

  try {
    const { data, error } = await supabase.auth.getClaims(token);

    if (error || !data?.claims) {
      return res.status(403).json({ error: "Invalid or expired token" }).end();
    }

    // const claims = data.claims as JwtPayload & { user_role?: string };

    if (data.claims.user_role === "authorized_user") {
      return next();
    } else {
      return res.status(403).json({
        error: "User not Authorized, contact administrator for authorization",
      }).end();
    }
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({ error: "Token verification failed" }).end();
  }
}

export default router;