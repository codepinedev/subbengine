import { config } from "dotenv";
import { expand } from "dotenv-expand";
import z from "zod";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number().default(3000),
  WS_PORT: z.coerce.number().default(8888),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "fatal", "trace"]),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  FRONTEND_URL: z.string().optional().default("http://localhost:3000"),
});

export type Env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports
let env: Env;

try {
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as z.ZodError;
  console.error("❌ Invalid environment variables");
  console.error(error.flatten());
  process.exit(1);
}

export default env;
