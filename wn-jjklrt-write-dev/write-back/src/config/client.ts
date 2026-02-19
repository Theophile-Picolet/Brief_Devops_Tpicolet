import dotenv from "dotenv";

dotenv.config();

import type { Pool as PgPool, QueryResult, QueryResultRow } from "pg";
// Import pg for PostgreSQL
import { Pool } from "pg";

console.log("Chargement client.ts");
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

console.log("DB_HOST:", DB_HOST);
console.log("DB_PORT:", DB_PORT);
console.log("DB_USER:", DB_USER);
console.log("DB_NAME:", DB_NAME);
// Create a new PostgreSQL client using environment variables

const client = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
});

export default client;

type Pg = PgPool;
type Result = QueryResult<QueryResultRow>;
type Rows = QueryResultRow[];

export type { Pg, Result, Rows };
