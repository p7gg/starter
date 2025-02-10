import { invariant } from "@epic-web/invariant";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./drizzle";

const connectionString = process.env.ZERO_UPSTREAM_DB;
invariant(connectionString, "Missing database URL");

export const db = drizzle({
	client: new pg.Pool({ connectionString }),
	schema,
});
