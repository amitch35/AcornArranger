import express, { Request, Response } from "express";
import path from "path";
import properties from './routes/properties';
import staff from './routes/staff';
import roles from './routes/roles';
import appointments from './routes/appointments';
import plans from './routes/plans';
import services from './routes/services'
import auth, { supabaseMiddleware } from "./routes/auth";
import dotenv from "dotenv";

dotenv.config({ path: ['.env.local', '.env'] });

const { queryParser } = require('express-query-parser')
const app = express();
const port = process.env.PORT || 3000;
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

app.use('/auth', auth);

app.use('/api/properties', supabaseMiddleware, properties);

app.use('/api/staff', supabaseMiddleware, staff);

app.use('/api/roles', supabaseMiddleware, roles);

app.use('/api/appointments', supabaseMiddleware, appointments);

app.use('/api/plans', supabaseMiddleware, plans);

app.use('/api/services', supabaseMiddleware, services);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});