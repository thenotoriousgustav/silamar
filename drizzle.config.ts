import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Muat file .env.local
config({ path: ".env.local" });

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
