import express, { Request, Response } from "express";
import path from "path";
import fs from "node:fs/promises";
import properties from './routes/properties';
import staff from './routes/staff';
import roles from './routes/roles';
import appointments from './routes/appointments';
import plans from './routes/plans';
import services from './routes/services'
import auth, { supabaseMiddleware } from "./routes/auth";
import dotenv from "dotenv";

dotenv.config({ path: ['.env.local', '.env'] });

// Global error handlers for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

const { queryParser } = require('express-query-parser')
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir, { dotfiles: "deny" }));

app.use(express.json());

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  })
)

// NPM packages exposed to the browser.
// Previously this mounted the entire node_modules tree at /node_modules, which
// exposed every file (READMEs, source maps, anything next to node_modules).
// The proto frontend's import map only requests
//   /node_modules/@calpoly/mustang/dist/mustang.mjs
// scope the public mount to exactly that subtree.
const mustangDist = path.resolve(
  __dirname,
  "../../../node_modules/@calpoly/mustang/dist"
);
console.log("Serving @calpoly/mustang from", mustangDist);
app.use(
  "/node_modules/@calpoly/mustang/dist",
  express.static(mustangDist, { dotfiles: "deny", index: false })
);

app.use('/auth', auth);

app.use('/api/properties', supabaseMiddleware, properties);

app.use('/api/staff', supabaseMiddleware, staff);

app.use('/api/roles', supabaseMiddleware, roles);

app.use('/api/appointments', supabaseMiddleware, appointments);

app.use('/api/plans', supabaseMiddleware, plans);

app.use('/api/services', supabaseMiddleware, services);

// SPA Routes: /app/...
app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});