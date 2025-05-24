import React from 'react';

const EnvTest = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>Environment Variables Debug</h3>
      <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
      <p><strong>REACT_APP_SUPABASE_URL:</strong> {supabaseUrl || 'MISSING'}</p>
      <p><strong>REACT_APP_SUPABASE_ANON_KEY:</strong> {supabaseAnonKey ? 'SET (' + supabaseAnonKey.length + ' chars)' : 'MISSING'}</p>
      <p><strong>All REACT_APP vars:</strong></p>
      <pre style={{ fontSize: '12px', backgroundColor: '#fff', padding: '10px' }}>
        {JSON.stringify(
          Object.keys(process.env)
            .filter(key => key.startsWith('REACT_APP_'))
            .reduce((obj, key) => {
              obj[key] = key.includes('KEY') ? '***HIDDEN***' : process.env[key];
              return obj;
            }, {}),
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default EnvTest; 