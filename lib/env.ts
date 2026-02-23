import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    EMAIL_HOST: z.string().min(1),
    EMAIL_PORT: z.coerce.number(),
    EMAIL_USER: z.string().min(1),
    EMAIL_PASS: z.string().min(1),
    EMAIL_FROM: z.string().email(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional(),
    NEXT_PUBLIC_CONTACT_PHONE: z.string().optional(),
    NEXT_PUBLIC_CONTACT_WHATSAPP: z.string().optional(),
    NEXT_PUBLIC_CONTACT_ADDRESS: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE,
    NEXT_PUBLIC_CONTACT_WHATSAPP: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP,
    NEXT_PUBLIC_CONTACT_ADDRESS: process.env.NEXT_PUBLIC_CONTACT_ADDRESS,
  },
});
