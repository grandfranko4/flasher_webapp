import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug logging for production
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: supabaseUrl ? 'SET' : 'MISSING',
  SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'MISSING',
  // Show first few characters for debugging (safe)
  URL_START: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined',
});

if (!supabaseUrl) {
  throw new Error(`Missing REACT_APP_SUPABASE_URL environment variable. Current value: ${supabaseUrl}`);
}

if (!supabaseAnonKey) {
  throw new Error(`Missing REACT_APP_SUPABASE_ANON_KEY environment variable. Current value: ${supabaseAnonKey}`);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid REACT_APP_SUPABASE_URL format: ${supabaseUrl}. Error: ${error.message}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export default supabase; 