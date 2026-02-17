// Config pour le Cron: connexion à PostgreSQL

import { Pool } from 'pg';
import type { Pool as PgPool, QueryResult } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

console.log(pool);

type Pg = PgPool;
type Result = QueryResult<any>;
type Rows = any[];

export type { Pg, Result, Rows };

export default pool;