import { createClient } from '@supabase/supabase-js';

// These MUST be defined (Vercel passes NEXT_PUBLIC_* at build and runtime)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// If either is empty throw a helpful build‑time error
if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Supabase env vars are missing! Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

/**
 * A single Supabase client for the whole app.
 * Works in server‑side code (build/prerender) and in the browser.
 */
export const supabase = createClient(supabaseUrl, supabaseAnon);
