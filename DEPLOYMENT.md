# 🚀 Netlify Deployment Guide for Flasher WebApp

This guide provides step-by-step instructions for deploying the React admin webapp to Netlify.

## 📋 Prerequisites

- [Netlify account](https://netlify.com) (free tier works)
- GitHub repository with the admin webapp code
- Supabase project credentials

## 🔧 Configuration Files

The repository includes the following Netlify configuration files:

- `netlify.toml` - Main Netlify configuration
- `public/_redirects` - Backup redirect rules for React Router
- `.env.example` - Environment variable template

## 🚀 Deployment Steps

### 1. Connect Repository to Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Select the `flasher_webapp` repository
5. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: Leave empty (or specify if in subdirectory)

### 2. Set Environment Variables

In Netlify dashboard, go to **Site settings > Environment variables** and add:

```bash
# Required Supabase Configuration
REACT_APP_SUPABASE_URL=https://gtjeaazmelddcjwpsxvp.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional Build Configuration
CI=false
GENERATE_SOURCEMAP=false
NODE_VERSION=18
```

> ⚠️ **Important**: Never commit real environment variables to the repository!

### 3. Deploy Configuration

The `netlify.toml` file includes:

- **Build Configuration**: React build command and output directory
- **SPA Redirects**: All routes redirect to `index.html` for React Router
- **Security Headers**: XSS protection, frame options, content type protection
- **Performance**: Static asset caching and optimization
- **Node.js Version**: Fixed to v18 for consistency

### 4. Domain Configuration

After deployment:

1. **Custom Domain** (optional):
   - Go to **Site settings > Domain management**
   - Add your custom domain
   - Configure DNS settings as instructed

2. **HTTPS**: Automatically enabled by Netlify

## 🔒 Security Configuration

### Environment Variables Security

1. **Supabase Keys**:
   - Use the **anon key** (public) - safe for client-side
   - Never use the **service role key** in frontend apps

2. **RLS (Row Level Security)**:
   - Ensure Supabase tables have proper RLS policies
   - Admin access should be controlled via database policies

### Headers

The configuration includes security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `X-Content-Type-Options: nosniff` - MIME type sniffing protection

## 📊 Performance Optimization

### Build Optimization
- CSS and JS bundling and minification
- Source map generation disabled for production
- Static asset caching (1 year for /static/* files)

### React Optimization
- Code splitting via React.lazy (if implemented)
- Bundle size analysis available via `npm run build`

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**:
   ```bash
   # Check package.json dependencies
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**:
   - Verify variables are set in Netlify dashboard
   - Check variable names start with `REACT_APP_`
   - Redeploy after adding variables

3. **Routing Issues (404 on refresh)**:
   - Verify `_redirects` file is in `public/` directory
   - Check `netlify.toml` redirect configuration

4. **Supabase Connection Issues**:
   ```bash
   # Test Supabase connection
   npm run debug-auth
   ```

### Build Logs

Access build logs in Netlify dashboard:
1. Go to **Deploys** tab
2. Click on latest deploy
3. View build logs for errors

## 🔄 Continuous Deployment

### Automatic Deployments

- **Main Branch**: Automatic deployment on push to `main`
- **Pull Requests**: Deploy previews for PRs (optional)
- **Branch Deploys**: Configure specific branches for staging

### Deploy Hooks

Create deploy hooks for external triggers:
1. **Site settings > Build & deploy > Deploy hooks**
2. Create hook for manual deployments
3. Use webhook URL for external services

## 📈 Monitoring

### Analytics
- Enable Netlify Analytics in site dashboard
- Monitor page views, unique visitors, bandwidth

### Performance
- Use Lighthouse for performance audits
- Monitor Core Web Vitals via Netlify dashboard

## 🌐 Custom Domain Setup

### DNS Configuration

For custom domain `admin.yoursite.com`:

1. **CNAME Record**:
   ```
   admin.yoursite.com → your-site-name.netlify.app
   ```

2. **A Record** (apex domain):
   ```
   yoursite.com → 104.198.14.52
   ```

### SSL Certificate
- Automatic Let's Encrypt certificate
- Custom certificates supported for paid plans

## 📱 Mobile Responsiveness

The admin webapp is built with Material-UI for responsive design:
- Responsive breakpoints: xs, sm, md, lg, xl
- Mobile-first approach
- Touch-friendly interface

## 🔧 Advanced Configuration

### Build Plugins

Add to `netlify.toml` for additional functionality:
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"

[[plugins]]
  package = "netlify-plugin-checklinks"
```

### Edge Functions

For advanced server-side functionality:
```toml
[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"
```

## 📞 Support

- **Netlify Support**: [netlify.com/support](https://netlify.com/support)
- **Documentation**: [docs.netlify.com](https://docs.netlify.com)
- **Community**: [netlify.com/community](https://netlify.com/community)

---

## 🎉 Quick Deploy Button

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/grandfranko4/flasher_webapp)

> Click the button above for one-click deployment! 