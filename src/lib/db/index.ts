import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export const client = mysql.createPool({
  user: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
});

export const db = drizzle(client);
