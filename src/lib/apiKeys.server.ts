// Server-only helpers: user-scoped Supabase client + API keys stored in platform_settings
// (rows are readable only by super admins via RLS). Falls back to process.env.
import { createClient } from "@supabase/supabase-js";

export const API_KEY_SETTINGS = { openrouter: "openrouter_api_key", resend: "resend_api_key" } as const;

export function supabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase URL / publishable key are missing from the build");
  return { url: url as string, key: key as string };
}

/** Supabase client acting as the signed-in caller (RLS applies). */
export function userClient(token: string): any {
  const { url, key } = supabaseConfig();
  return createClient(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

/** Verifies the token belongs to a super admin; returns a client scoped to them. */
export async function requireSuperAdminClient(token: string) {
  const db = userClient(token);
  const { data: u, error } = await db.auth.getUser(token);
  if (error || !u?.user) throw new Error("Please sign in again");
  const { data: ok } = await db.rpc("is_super_admin", { _user_id: u.user.id });
  if (!ok) throw new Error("Only super admins can do this");
  return { db, userId: u.user.id as string };
}

/** Reads a key saved in Admin → Platform Settings, else the server environment. */
export async function getApiKey(db: any, which: keyof typeof API_KEY_SETTINGS, envName: string): Promise<string> {
  try {
    const { data } = await db.from("platform_settings").select("value").eq("key", API_KEY_SETTINGS[which]).maybeSingle();
    const v = data?.value;
    const k = typeof v === "string" ? v : v?.key;
    if (typeof k === "string" && k.trim()) return k.trim();
  } catch { /* fall back */ }
  const env = process.env[envName];
  if (env) return env;
  throw new Error(`No ${which === "openrouter" ? "OpenRouter" : "Resend"} key saved. Add it in Admin → Platform Settings → API keys.`);
}
