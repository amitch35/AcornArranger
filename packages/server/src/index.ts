import express, { Request, Response } from "express";
import path from "path";
import {supabaseClient} from './utils/supabase/server';
import properties from './routes/properties';
import staff from './routes/staff';
import roles from './routes/roles';
import appointments from './routes/appointments';
import plans from './routes/plans';
import auth, { supabaseMiddleware } from "./routes/auth";
import dotenv from "dotenv";

dotenv.config({ path: ['.env.local', '.env'] });

const { queryParser } = require('express-query-parser')
const app = express();
const port = process.env.PORT || 4000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.use(express.json());

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  })
)

// NPM Packages
const nodeModules = path.resolve(
  __dirname,
  "../../../node_modules"
);
console.log("Serving NPM packages from", nodeModules);
app.use("/node_modules", express.static(nodeModules));

const supabase = supabaseClient;

app.use('/auth', auth);

app.use('/api/properties', properties);

app.use('/api/staff', staff);

app.use('/api/roles', supabaseMiddleware, roles);

app.use('/api/appointments', appointments);

app.use('/api/plans', plans)

// Local User Session
app.get('/api/user-session', async (req: Request, res: Response) => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});