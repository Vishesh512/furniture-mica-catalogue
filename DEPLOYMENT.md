# Netlify Deployment Guide

## Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Furniture Mica Catalogue - Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select "GitHub" and authorize
   - Choose your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: (leave empty or /)
   - Click "Deploy site"

3. **Configure Domain**
   - Go to Site Settings
   - Change site name to something like: `furniture-mica-catalogue`
   - Your URL will be: `https://furniture-mica-catalogue.netlify.app`

### Option 2: Deploy with Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 3: Drag & Drop Deploy

1. Go to https://app.netlify.com/drop
2. Drag your entire project folder
3. Wait for deployment to complete
4. Your site is live!

## Post-Deployment Checklist

- [ ] Test home page loads correctly
- [ ] Check catalogue page with filters
- [ ] Test search functionality
- [ ] Verify dark mode works
- [ ] Check responsive design on mobile
- [ ] Test contact form
- [ ] Test WhatsApp integration
- [ ] Verify admin panel is accessible

## Custom Domain (Optional)

1. Purchase a domain (GoDaddy, Namecheap, etc.)
2. In Netlify Site Settings → Domain Management
3. Click "Add custom domain"
4. Add your domain
5. Update DNS records (follow Netlify instructions)

## SSL Certificate

- Netlify automatically provides free SSL certificate
- All traffic automatically redirected to HTTPS
- No additional setup required

## Performance Optimization

### Enable Asset Optimization
1. Go to Site Settings → Build & deploy → Post processing
2. Enable "Minify CSS", "Minify JavaScript", "Pretty URLs"

### Configure Cache
The `netlify.toml` file includes cache rules:
- HTML: 1 hour cache
- Assets (CSS, JS): 1 year cache

## Environment Variables (if needed)

1. Go to Site Settings → Build & deploy → Environment
2. Add any environment variables needed
3. Rebuild the site

## Monitoring & Analytics

### Enable Netlify Analytics
1. Site Settings → General
2. Scroll to "Analytics"
3. Click "Enable Netlify Analytics"
4. View dashboard to track visits

### Site Monitoring
1. Site Settings → Netlify Functions
2. Monitor function performance
3. View logs and errors

## Continuous Deployment

Once GitHub is connected:
- Every push to `main` branch auto-deploys
- Previous deployments accessible in history
- Easy rollback if needed

To disable auto-deploy:
1. Site Settings → Build & deploy → Deploy contexts
2. Uncheck "Automatic deployments"

## Troubleshooting

### Site shows blank page
- Check browser console (F12) for errors
- Verify all files are deployed
- Clear browser cache

### Admin panel not working
- Check localStorage access
- Verify password is set correctly
- Try incognito/private window

### Images not loading
- Verify image URLs are public
- Check image URLs in products
- Use absolute URLs for all images

### Search not working
- Check browser console for errors
- Verify JavaScript files are loaded
- Clear localStorage and reload

## Security Configuration

The `netlify.toml` includes security headers:
- Content Security Policy
- XSS Protection
- Clickjacking prevention
- MIME type sniffing prevention

For production, customize these headers based on your needs.

## DNS Configuration (Custom Domain)

If using external DNS:

1. Get Netlify's DNS servers from deployment summary
2. Update domain registrar DNS:
   - NS1: `dns1.netlify.com`
   - NS2: `dns2.netlify.com`
   - NS3: `dns3.netlify.com`
   - NS4: `dns4.netlify.com`

3. Wait 24-48 hours for DNS propagation
4. Verify with `nslookup yourdomain.com`

## Rollback Deployment

1. Go to Deploys
2. Find previous working deployment
3. Click "Restore" or "Rollback"
4. Site will revert to that version

## Advanced: Form Submissions

To enable contact form submissions:

1. Add `netlify-form` attribute to form
2. Ensure form has `name` attribute
3. Form submissions appear in Netlify admin

```html
<form name="contact" netlify>
  <!-- form fields -->
</form>
```

## Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Status Page**: https://status.netlify.com
- **Community**: https://community.netlify.com
- **Support**: support@netlify.com

---

**Deployment Status**: ✅ Ready for Production
**Last Updated**: June 2024