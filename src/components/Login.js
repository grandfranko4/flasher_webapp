import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Redirect if already authenticated and admin
  useEffect(() => {
    console.log('Login component - Auth state:', { user: user?.email, isAdmin, loading });
    if (user && isAdmin && !loading) {
      console.log('Redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  const onSubmit = async (data) => {
    try {
      console.log('Login form submitted:', data.email);
      await signIn(data.email, data.password);
      // Don't manually navigate here - let the useEffect handle it
    } catch (error) {
      console.error('Login form error:', error);
      // Error handling is done in AuthContext
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={10} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <AdminPanelSettings 
              sx={{ 
                fontSize: 60, 
                color: 'primary.main',
                mb: 2 
              }} 
            />
            <Typography component="h1" variant="h4" fontWeight="bold">
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              USDT Flasher Pro Admin Dashboard
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  {...register('email')}
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                  defaultValue="mikebtcretriever@gmail.com"
                />

                <TextField
                  {...register('password')}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                  defaultValue="Gateway@523"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 2, 
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Access restricted to authorized administrators only
            </Typography>
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="caption" display="block">
                  Debug Info:
                </Typography>
                <Typography variant="caption" display="block">
                  User: {user?.email || 'None'}
                </Typography>
                <Typography variant="caption" display="block">
                  Admin: {isAdmin ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="caption" display="block">
                  Loading: {loading ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 