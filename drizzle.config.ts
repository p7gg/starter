import { invariant } from "@epic-web/invariant";
import { defineConfig } from "drizzle-kit";

const url = process.env.ZERO_UPSTREAM_DB;
invariant(url, "Missing database URL");

export default defineConfig({
	out: "./others/drizzle",
	schema: "./app/modules/.server/drizzle.ts",
	dialect: "postgresql",
	dbCredentials: {
		url,
	},
});
