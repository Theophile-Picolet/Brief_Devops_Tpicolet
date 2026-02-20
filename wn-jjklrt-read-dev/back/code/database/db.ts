// Config pour le Cron: connexion à PostgreSQL

import dotenv from "dotenv";

// Charger les variables d'environnement (avec support de .env.test)
dotenv.config();

import type { Pool as PgPool, QueryResult, QueryResultRow } from "pg";
import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

console.log(pool);

type Pg = PgPool;
type Result = QueryResult<QueryResultRow>;
type Rows = QueryResultRow[];

export type { Pg, Result, Rows };

export default pool;
