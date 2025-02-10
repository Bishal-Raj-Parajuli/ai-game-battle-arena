import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "dotenv";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL!);

const db = drizzle({
  client: client,
  schema: schema,
});

export default db;
