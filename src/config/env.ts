import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  BETTER_AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // AI
  OPENAI_API_KEY: z.string().startsWith("sk-"),

  // Payment
  MIDTRANS_SERVER_KEY: z.string().min(1),
  MIDTRANS_CLIENT_KEY: z.string().min(1),
  MIDTRANS_IS_PRODUCTION: z.string().default("false"),

  // Storage
  UPLOADTHING_TOKEN: z.string().min(1),
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1).optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1).optional(),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().min(1).optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Email
  RESEND_API_KEY: z.string().startsWith("re_"),
  RESEND_FROM_EMAIL: z.string().default("noreply@silamar.id"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues.map(
      (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
    );
    console.error("❌ Environment validation failed:");
    console.error(formatted.join("\n"));
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
