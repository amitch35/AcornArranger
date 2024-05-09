import express, { Request, Response } from "express";
import {supabaseClient} from './utils/supabase/server';
import properties from './routes/properties';
import staff from './routes/staff';
import roles from './routes/roles';
import appointments from './routes/appointments';
import plans from './routes/plans';
import auth from './routes/auth';

require('dotenv').config({ path: ['.env.local', '.env'] });

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

const supabase = supabaseClient()

app.use('/auth', auth);

app.use('/api/properties', properties);

app.use('/api/staff', staff);

app.use('/api/roles', roles);

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