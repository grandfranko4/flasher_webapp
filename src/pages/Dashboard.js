import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  VpnKey,
  Settings,
  TrendingUp,
  People,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLicenseKeys: 0,
    activeLicenseKeys: 0,
    expiredLicenseKeys: 0,
    totalUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load license keys stats
      const { data: licenseKeys, error: licenseError } = await supabase
        .from('license_keys')
        .select('*');

      if (licenseError) throw licenseError;

      // Load users count
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id');

      if (userError) throw userError;

      // Calculate stats
      const now = new Date();
      const activeLicenses = licenseKeys.filter(
        (key) => key.status === 'active' && new Date(key.expires_at) > now
      );
      const expiredLicenses = licenseKeys.filter(
        (key) => key.status === 'expired' || new Date(key.expires_at) <= now
      );

      setStats({
        totalLicenseKeys: licenseKeys.length,
        activeLicenseKeys: activeLicenses.length,
        expiredLicenseKeys: expiredLicenses.length,
        totalUsers: users.length,
      });

      // Generate recent activity (mock data for now)
      const activities = [
        {
          id: 1,
          type: 'license_created',
          message: 'New license key created',
          time: '2 hours ago',
          icon: <VpnKey />,
          color: 'success',
        },
        {
          id: 2,
          type: 'settings_updated',
          message: 'App settings updated',
          time: '4 hours ago',
          icon: <Settings />,
          color: 'info',
        },
        {
          id: 3,
          type: 'license_expired',
          message: 'License key expired',
          time: '1 day ago',
          icon: <Cancel />,
          color: 'error',
        },
        {
          id: 4,
          type: 'user_registered',
          message: 'New user registered',
          time: '2 days ago',
          icon: <People />,
          color: 'primary',
        },
      ];

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 2,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {loading ? '...' : value}
            </Typography>
            <Typography variant="h6" color="text.primary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to the USDT Flasher Pro Admin Panel
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total License Keys"
            value={stats.totalLicenseKeys}
            icon={<VpnKey />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Licenses"
            value={stats.activeLicenseKeys}
            icon={<CheckCircle />}
            color="success"
            subtitle="Currently valid"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expired Licenses"
            value={stats.expiredLicenseKeys}
            icon={<Cancel />}
            color="error"
            subtitle="Need renewal"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<People />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              System Overview
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Chip
                icon={<TrendingUp />}
                label="System Status: Operational"
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<VpnKey />}
                label={`${stats.activeLicenseKeys} Active Licenses`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<Settings />}
                label="Settings Synchronized"
                color="info"
                variant="outlined"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            <List dense>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${activity.color}.light`,
                          color: `${activity.color}.main`,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 