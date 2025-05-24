import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set a maximum loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, setting loading to false');
      setLoading(false);
    }, 10000); // 10 seconds timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(loadingTimeout);
      if (session) {
        setUser(session.user);
        checkAdminStatus(session.user);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      clearTimeout(loadingTimeout);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, 'User:', session?.user?.email);
        if (session) {
          console.log('👤 Setting user and checking admin status...');
          setUser(session.user);
          const adminStatus = await checkAdminStatus(session.user);
          
          console.log('🔍 Admin status result:', adminStatus, 'Event:', event);
          
          if (event === 'SIGNED_IN' && !adminStatus) {
            console.log('🚫 User is not admin, signing out...');
            await supabase.auth.signOut();
            toast.error('Access denied. Admin privileges required.');
            return;
          }
          
          if (adminStatus) {
            console.log('🎉 Admin login successful');
            toast.success('Successfully signed in!');
          }
        } else {
          console.log('👤 No session, clearing user data');
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (user) => {
    console.log('🔍 checkAdminStatus called with:', user?.email);
    
    if (!user) {
      console.log('❌ No user provided');
      setIsAdmin(false);
      setLoading(false);
      return false;
    }

    try {
      console.log('🔍 Checking admin status for:', user.email);
      
      // Check if user exists in users table with admin role
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', user.email)
        .single();

      console.log('📊 Database query result:', { data, error });

      if (error) {
        console.error('❌ Error checking admin status:', error);
        if (error.code === 'PGRST116') {
          // User not found in users table
          console.log('⚠️ User not found in users table, creating entry...');
          
          // Create user entry with default role
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              email: user.email,
              display_name: user.user_metadata?.full_name || user.email,
              role: 'user', // Default role
              created_at: new Date().toISOString(),
            }]);

          if (insertError) {
            console.error('❌ Error creating user entry:', insertError);
          } else {
            console.log('✅ User entry created with default role');
          }
          
          setIsAdmin(false);
          setLoading(false);
          return false;
        }
        
        console.log('❌ Setting admin status to false due to error');
        setIsAdmin(false);
        setLoading(false);
        return false;
      }

      const adminStatus = data?.role === 'admin';
      console.log('🎯 Admin status check result:', { 
        email: user.email, 
        role: data?.role, 
        isAdmin: adminStatus 
      });
      
      setIsAdmin(adminStatus);
      setLoading(false);
      console.log('✅ Loading set to false, admin status:', adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('💥 Exception in checkAdminStatus:', error);
      setIsAdmin(false);
      setLoading(false);
      return false;
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting to sign in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        throw error;
      }

      console.log('Sign in successful, waiting for auth state change...');
      
      // Don't manually call checkAdminStatus here - let the auth state change handler do it
      // The useEffect listener will handle the admin status check
      
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAdmin(false);
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 