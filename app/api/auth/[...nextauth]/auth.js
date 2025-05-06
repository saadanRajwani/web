import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Add static export directives
export const dynamic = "force-static";
export const revalidate = false;

// Rate limiting for login attempts - in-memory store
// Note: For production with multiple servers, use Redis or similar
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5, // 5 attempts per IP
  ipAttempts: new Map()
};

// Clean rate limiting data every hour
setInterval(() => {
  RATE_LIMIT.ipAttempts.clear();
}, 60 * 60 * 1000);

// Create auth options object - use as a constant to avoid dynamic API calls
export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Get IP address for rate limiting - using a safer approach
        let ip = "unknown-ip";
        if (req.headers) {
          ip = req.headers["x-forwarded-for"] || ip;
        }
        
        // Check rate limit for the IP
        const currentTime = Date.now();
        const ipData = RATE_LIMIT.ipAttempts.get(ip) || { count: 0, resetTime: currentTime + RATE_LIMIT.windowMs };
        
        if (currentTime > ipData.resetTime) {
          // Reset if window expired
          ipData.count = 1;
          ipData.resetTime = currentTime + RATE_LIMIT.windowMs;
        } else {
          // Increment counter
          ipData.count += 1;
        }
        
        RATE_LIMIT.ipAttempts.set(ip, ipData);
        
        // Check if rate limit exceeded
        if (ipData.count > RATE_LIMIT.maxAttempts) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        try {
          // Find the user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          // Check if user exists
          if (!user) {
            // Return null for non-existent user (don't give away info)
            return null;
          }

          // Check if account is locked
          if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            throw new Error("Account temporarily locked. Try again later or reset your password.");
          }
          
          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // Handle failed login attempts
          if (!isPasswordValid) {
            // Update failed login attempts
            const updatedFailedAttempts = user.failedLoginAttempts + 1;
            
            // Lock account after 5 consecutive failed attempts
            if (updatedFailedAttempts >= 5) {
              // Lock for 30 minutes
              const lockUntil = new Date(Date.now() + 30 * 60 * 1000);
              
              await prisma.user.update({
                where: { id: user.id },
                data: { 
                  failedLoginAttempts: updatedFailedAttempts,
                  lockedUntil: lockUntil
                }
              });
              
              throw new Error("Account locked due to multiple failed attempts. Try again after 30 minutes.");
            } else {
              // Just increment the counter
              await prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: updatedFailedAttempts }
              });
            }
            
            return null;
          }

          // Reset failed login attempts on successful login
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              failedLoginAttempts: 0,
              lockedUntil: null,
              lastLogin: new Date()
            }
          });

          // Also update the user profile last active timestamp
          await prisma.userProfile.update({
            where: { userId: user.id },
            data: { lastActive: new Date() }
          });

          // Return user data without password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
    error: '/auth-error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Pass user id to token when we sign in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id to session
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  // Set JWT options
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24, // 24 hours
  },
  // Enable CSRF protection
  cookies: {
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions; 