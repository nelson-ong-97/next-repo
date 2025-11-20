import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";
import { existsSync } from "node:fs";

// Only load .env file if it exists (for local development)
const envPath = path.join(process.cwd(), "../../apps/web/.env");
if (existsSync(envPath)) {
	dotenv.config({
		path: envPath,
	});
}

// For prisma generate, we don't need a real DATABASE_URL, but the config requires it
// Use environment variable or a dummy URL as fallback
const databaseUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

export default defineConfig({
	schema: path.join("prisma", "schema"),
	migrations: {
		path: path.join("prisma", "migrations"),
	},
	datasource: {
		url: databaseUrl,
	},
});
