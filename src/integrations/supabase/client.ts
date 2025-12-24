import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xehdqfeadrxfhfevqsjk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaGRxZmVhZHJ4ZmhmZXZxc2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NjY5NDUsImV4cCI6MjA4MjE0Mjk0NX0.jlTrx3kJksiRYpC9nVpY5DsdkTm2ipXV8XiDfD6nAyA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);