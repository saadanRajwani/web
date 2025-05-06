# MasjidQuran - Collaborative Quran Reading Platform

A web application that allows Muslims to join together in reading the Quran collaboratively, completing khatms (full readings) as a community.

## Features

- User authentication with security features
- Dashboard showing community reading progress
- Interactive Quran reader interface
- Progress tracking and statistics
- Mobile-responsive design
- Profile management system

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth.js

## Deployment Guide

### Option 1: Vercel (Recommended)

The easiest way to deploy this application is using Vercel, which is optimized for Next.js projects.

1. **Prepare Your Code**

   - Make sure your repository is on GitHub, GitLab, or Bitbucket
   - Ensure all changes are committed

2. **Setup a Vercel Account**

   - Visit [vercel.com](https://vercel.com) and create an account
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)

3. **Import Your Project**

   - From the Vercel dashboard, click "Add New" → "Project"
   - Select your repository from the list
   - Configure your project settings:
     - Set the build command as `next build` (already in your package.json)
     - Set the output directory to `.next` (default)

4. **Configure Environment Variables**

   In the Vercel project settings, add the following environment variables:

   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database
   NEXTAUTH_SECRET=your-secure-random-string-here
   NEXTAUTH_URL=https://your-production-domain.com
   NODE_ENV=production
   ```

5. **Setup a Production Database**

   - For PostgreSQL, you can use services like:
     - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
     - [Supabase](https://supabase.com/)
     - [Railway](https://railway.app/)
     - [Neon](https://neon.tech/)

6. **Deploy**

   - Click "Deploy" and wait for your project to build
   - Vercel will automatically configure the correct settings for Next.js

7. **Custom Domain** (Optional)

   - In the Vercel dashboard, go to your project → Domains
   - Add your custom domain and follow the instructions

### Option 2: Self-Hosting

If you prefer to host the application yourself:

1. **Choose a Hosting Provider**

   Select a server that supports Node.js, such as:
   - DigitalOcean
   - Linode/Akamai
   - AWS EC2
   - Google Cloud

2. **Prepare Your Server**

   - Install Node.js (v18 or newer)
   - Install PM2 for process management: `npm install -g pm2`
   - Set up PostgreSQL database

3. **Clone and Configure Your Project**

   ```bash
   git clone <your-repository-url>
   cd quran-reader
   npm install
   ```

4. **Setup Environment Variables**

   Create a `.env` file with:

   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database
   NEXTAUTH_SECRET=your-secure-random-string-here
   NEXTAUTH_URL=https://your-production-domain.com
   NODE_ENV=production
   ```

5. **Build the Application**

   ```bash
   npm run build
   ```

6. **Run with PM2**

   ```bash
   pm2 start npm --name "quran-reader" -- start
   pm2 save
   pm2 startup
   ```

7. **Setup Reverse Proxy**

   Configure Nginx or Apache as a reverse proxy to your Node.js application.

   Example Nginx configuration:

   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

8. **SSL Certificate**

   Use Certbot to obtain a free SSL certificate:

   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## Mobile-Responsive Design

This application is designed to work well on all devices:

- Responsive layouts that adapt to screen size
- Touch-friendly interface elements
- Optimized readability on small screens
- Progressive Web App capabilities

## Browser Compatibility

The application is compatible with:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 