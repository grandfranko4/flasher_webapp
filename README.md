# USDT Flasher Pro - Admin Web App

A complete admin dashboard for managing USDT Flasher Pro license keys and application settings with full CRUD functionality.

## Features

### 🔐 Secure Authentication
- Admin-only access with role-based authentication
- Secure login with form validation
- Session management with auto-refresh tokens
- Protected routes with authentication guards

### 📊 Dashboard Overview
- Real-time statistics and metrics
- License key status monitoring
- System health indicators
- Recent activity tracking

### 🔑 License Keys Management
- **Create** new license keys with custom parameters
- **Read** and view all license keys in a data grid
- **Update** existing license key details
- **Delete** license keys with confirmation dialogs
- Advanced filtering and pagination
- Export capabilities

### ⚙️ App Settings Management
- **Complete CRUD** for all app settings fields
- Organized settings in collapsible sections:
  - General Settings (version, updates, API)
  - UI/UX Settings (theme, colors, animations)
  - Security Settings (timeouts, authentication)
  - Flash Settings (networks, amounts, delays)
  - Payment Settings (deposits, fees, wallets)
  - Success Modal Settings (titles, messages)
  - Debug Settings (logging, debug mode)

### 🎨 Modern UI/UX
- Material-UI components with custom theming
- Responsive design for all screen sizes
- Dark/light theme support
- Beautiful animations and transitions
- Toast notifications for user feedback
- Professional admin panel layout

## Technology Stack

- **Frontend**: React.js 18
- **UI Framework**: Material-UI (MUI) v5
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Form Management**: React Hook Form + Yup validation
- **Routing**: React Router v6
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Data Grid**: MUI X DataGrid

## Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Supabase project with configured database

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd admin-webapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**:
   Ensure your Supabase database has the following tables:
   - `license_keys`
   - `app_settings`
   - `users`
   
   Refer to the main project's `SUPABASE-MIGRATION.md` for the complete schema.

5. **Admin User Setup**:
   Create an admin user in your Supabase authentication:
   ```sql
   INSERT INTO users (email, display_name, role) 
   VALUES ('admin@example.com', 'Admin User', 'admin');
   ```

## Usage

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Access the admin panel**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

3. **Login**:
   Use your admin credentials to access the dashboard

4. **Navigate the interface**:
   - **Dashboard**: Overview of system statistics
   - **License Keys**: Manage all license keys
   - **App Settings**: Configure application settings

## Features Overview

### Dashboard
- Real-time license key statistics
- System status indicators
- Recent activity feed
- Quick access to key metrics

### License Keys Management
- **Add New License**: Create licenses with custom expiration, type, and limits
- **Edit Existing**: Modify license parameters and user assignments
- **Delete Licenses**: Remove licenses with confirmation
- **Status Management**: Update license status (active, expired, suspended)
- **Search & Filter**: Find licenses quickly
- **Bulk Operations**: Mass actions on selected licenses

### App Settings Management
- **General Settings**: App version, update channels, API endpoints
- **UI/UX Settings**: Themes, colors, animations, user experience
- **Security Settings**: Session timeouts, password requirements, 2FA
- **Flash Settings**: Network preferences, amount limits, delay settings
- **Payment Settings**: Deposit amounts, transaction fees, wallet addresses
- **Success Modal**: Customize success messages and transaction details
- **Debug Settings**: Logging levels, debug mode configuration

## API Integration

The app integrates seamlessly with Supabase for:
- Real-time data synchronization
- Secure authentication
- Row Level Security (RLS)
- Automatic backups

## Security Features

- **Role-based access control**: Only admin users can access the panel
- **Session management**: Automatic token refresh and logout
- **Input validation**: All forms are validated client and server-side
- **Secure API calls**: All requests use authenticated Supabase client
- **XSS protection**: Input sanitization and output encoding

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## Customization

### Theming
Modify the theme in `src/App.js`:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
  },
});
```

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.js`
4. Add navigation items in `src/components/Layout.js`

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check Supabase credentials in `.env`
   - Verify admin user exists with correct role

2. **Database Connection Issues**:
   - Ensure Supabase URL and key are correct
   - Check database table schemas

3. **Build Errors**:
   - Clear node_modules and reinstall
   - Check for dependency conflicts

### Support

For technical support or questions:
- Check the main project documentation
- Review Supabase logs for database issues
- Inspect browser console for client-side errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the USDT Flasher Pro suite and follows the same licensing terms.
