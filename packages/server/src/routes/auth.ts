import express, { NextFunction, Request, Response } from "express";
import { supabaseClient } from "../utils/supabase/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
  
// router.post('/logout', async (req: Request, res: Response) => {
//     const { error } = await supabase.auth.signOut()
//     if (error) {
//       res.send(error);
//     } else {
//       res.send();
//     }
// });
  
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
      res.status(401).json({'error': 'Authorization header is not present'})
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
      res.status(401).json({'error': 'Authorization header is not present'}).end()
      break;
    default:
      jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
        if (error) res.send(error).end()
        else if (decoded) next();
        else res.status(403).end();
      });
      break;
  }
}

export default router;

// const supabase_middleware = async (req, res) => {
//   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {})
//   const JWT = getToken(req)

//   switch(JWT){
//     case null:
//       res.status(401).json({'error': 'no JWT parsed'})
//       break;
//     default:
//       const { user, error } = await supabase.auth.api.getUser(JWT)

//       if(error){ 
//         res.status(401).json(error) 
//       }else{ 
//         await supabase.auth.setAuth(JWT)
//         return {user,supabase} 
//       }
//       break;
//   }
// }