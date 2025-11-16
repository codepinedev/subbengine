import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "@/infrastructure/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: { enabled: true },
  basePath: "/api/auth",
  trustedOrigins: ["http://localhost:3000", "https://example.com"],
});
