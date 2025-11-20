import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Get the directory of this config file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load .env file if it exists (for local development)
// Try multiple possible paths for .env file
const possibleEnvPaths = [
  path.join(__dirname, "../../apps/web/.env"),
  path.join(process.cwd(), "../../apps/web/.env"),
  path.join(process.cwd(), ".env"),
];

for (const envPath of possibleEnvPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
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
