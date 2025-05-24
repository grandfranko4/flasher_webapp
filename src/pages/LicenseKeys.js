import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add,
  Edit,
  Delete,
  VpnKey,
  Refresh,
} from '@mui/icons-material';
import { supabase } from '../config/supabase';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  key: yup.string().required('License key is required'),
  status: yup.string().required('Status is required'),
  expires_at: yup.string().required('Expiration date is required'),
  user: yup.string().email('Invalid email').required('User email is required'),
  type: yup.string().required('Type is required'),
  max_amount: yup.number().positive('Must be positive').required('Max amount is required'),
});

const LicenseKeys = () => {
  const [licenseKeys, setLicenseKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [selectedKeyId, setSelectedKeyId] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      key: '',
      status: 'active',
      expires_at: '',
      user: '',
      type: 'demo',
      max_amount: 30,
    },
  });

  useEffect(() => {
    loadLicenseKeys();
  }, []);

  const loadLicenseKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('license_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLicenseKeys(data || []);
    } catch (error) {
      console.error('Error loading license keys:', error);
      toast.error('Failed to load license keys');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (key = null) => {
    if (key) {
      setEditingKey(key);
      reset({
        key: key.key,
        status: key.status,
        expires_at: key.expires_at ? key.expires_at.split('T')[0] : '',
        user: key.user,
        type: key.type,
        max_amount: key.max_amount,
      });
    } else {
      setEditingKey(null);
      reset({
        key: '',
        status: 'active',
        expires_at: '',
        user: '',
        type: 'demo',
        max_amount: 30,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingKey(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        expires_at: new Date(data.expires_at).toISOString(),
      };

      if (editingKey) {
        // Update existing key
        const { error } = await supabase
          .from('license_keys')
          .update(formattedData)
          .eq('id', editingKey.id);

        if (error) throw error;
        toast.success('License key updated successfully');
      } else {
        // Create new key
        const { error } = await supabase
          .from('license_keys')
          .insert([formattedData]);

        if (error) throw error;
        toast.success('License key created successfully');
      }

      handleCloseDialog();
      loadLicenseKeys();
    } catch (error) {
      console.error('Error saving license key:', error);
      toast.error('Failed to save license key');
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedKeyId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('license_keys')
        .delete()
        .eq('id', selectedKeyId);

      if (error) throw error;
      
      toast.success('License key deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedKeyId(null);
      loadLicenseKeys();
    } catch (error) {
      console.error('Error deleting license key:', error);
      toast.error('Failed to delete license key');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'suspended':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'live':
        return 'primary';
      case 'demo':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      field: 'key',
      headerName: 'License Key',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <VpnKey sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" fontFamily="monospace">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getTypeColor(params.value)}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'user',
      headerName: 'User Email',
      width: 200,
    },
    {
      field: 'max_amount',
      headerName: 'Max Amount',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          ${params.value?.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'expires_at',
      headerName: 'Expires',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            color="primary"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            License Keys Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage license keys for USDT Flasher Pro
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadLicenseKeys}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add License Key
          </Button>
        </Box>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={licenseKeys}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0',
            },
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingKey ? 'Edit License Key' : 'Add New License Key'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="key"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="License Key"
                      error={!!errors.key}
                      helperText={errors.key?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="user"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="User Email"
                      type="email"
                      error={!!errors.user}
                      helperText={errors.user?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                        <MenuItem value="suspended">Suspended</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>Type</InputLabel>
                      <Select {...field} label="Type">
                        <MenuItem value="demo">Demo</MenuItem>
                        <MenuItem value="live">Live</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="max_amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Max Amount"
                      type="number"
                      error={!!errors.max_amount}
                      helperText={errors.max_amount?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="expires_at"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Expiration Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.expires_at}
                      helperText={errors.expires_at?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingKey ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to delete this license key?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LicenseKeys; 