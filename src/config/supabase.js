import { createClient } from '@supabase/supabase-js';

// Get and clean environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY?.trim();

// Debug logging for production (non-sensitive info only)
console.log('Supabase Config Debug:', {
  NODE_ENV: process.env.NODE_ENV,
  URL_SET: !!supabaseUrl,
  KEY_SET: !!supabaseAnonKey,
  URL_LENGTH: supabaseUrl?.length || 0,
  KEY_LENGTH: supabaseAnonKey?.length || 0,
  URL_STARTS_WITH_HTTPS: supabaseUrl?.startsWith('https://'),
  URL_CONTAINS_SUPABASE: supabaseUrl?.includes('supabase.co'),
});

if (!supabaseUrl) {
  throw new Error(`Missing REACT_APP_SUPABASE_URL environment variable. Current value: "${supabaseUrl}"`);
}

if (!supabaseAnonKey) {
  throw new Error(`Missing REACT_APP_SUPABASE_ANON_KEY environment variable. Current value: "${supabaseAnonKey}"`);
}

// Validate URL format
if (!supabaseUrl.startsWith('https://')) {
  throw new Error(`REACT_APP_SUPABASE_URL must start with https://. Current: "${supabaseUrl}"`);
}

if (!supabaseUrl.includes('supabase.co')) {
  throw new Error(`REACT_APP_SUPABASE_URL must contain 'supabase.co'. Current: "${supabaseUrl}"`);
}

// Validate anon key format (should be a JWT)
if (!supabaseAnonKey.includes('.') || supabaseAnonKey.split('.').length !== 3) {
  throw new Error(`REACT_APP_SUPABASE_ANON_KEY appears to be invalid JWT format. Length: ${supabaseAnonKey.length}`);
}

// Test URL construction before creating Supabase client
try {
  const testUrl = new URL(supabaseUrl);
  console.log('URL validation successful:', testUrl.origin);
} catch (error) {
  throw new Error(`Invalid REACT_APP_SUPABASE_URL format: "${supabaseUrl}". Error: ${error.message}`);
}

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
  console.log('Supabase client created successfully');
} catch (error) {
  throw new Error(`Failed to create Supabase client: ${error.message}`);
}

export { supabase };
export default supabase; 