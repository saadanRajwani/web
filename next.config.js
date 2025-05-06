/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for development
  reactStrictMode: true,
  
  // Disable powered by header
  poweredByHeader: false,
  
  // Configure trailing slashes (true: /, false: no trailing slash)
  trailingSlash: false,
  
  // Enable image optimization
  images: {
    domains: ['localhost'],
    // Add your production image domains when deploying
    // domains: ['yourdomain.com', 'images.yourdomain.com'],
    
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    unoptimized: true,
  },
  
  // Environment variables (if needed)
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
  
  output: 'export',
};

module.exports = nextConfig; 