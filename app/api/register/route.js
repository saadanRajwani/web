import { NextResponse } from "next/server";

// Add these exports for static generation
export const dynamic = "force-static";
export const revalidate = false;

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Helper function to sanitize inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

// Rate limiting setup
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per IP
  ipRequests: new Map()
};

// Clean rate limiting data every hour
setInterval(() => {
  RATE_LIMIT.ipRequests.clear();
}, 60 * 60 * 1000);

// Force dynamic to fix the export errors
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const currentTime = Date.now();
    const ipData = RATE_LIMIT.ipRequests.get(ip) || { count: 0, resetTime: currentTime + RATE_LIMIT.windowMs };
    
    if (currentTime > ipData.resetTime) {
      // Reset if window expired
      ipData.count = 1;
      ipData.resetTime = currentTime + RATE_LIMIT.windowMs;
    } else {
      // Increment counter
      ipData.count += 1;
    }
    
    RATE_LIMIT.ipRequests.set(ip, ipData);
    
    // Check if rate limit exceeded
    if (ipData.count > RATE_LIMIT.maxRequests) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { name, email, username, bio, phoneNumber, password } = body;

    // Sanitize inputs to prevent XSS attacks
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedBio = sanitizeInput(bio);
    const sanitizedPhoneNumber = phoneNumber ? sanitizeInput(phoneNumber) : null;

    // Basic validation
    if (!sanitizedName || !sanitizedEmail || !sanitizedUsername || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Username validation (no special characters except underscore)
    const usernameRegex = /^[a-z0-9_]{3,}$/;
    if (!usernameRegex.test(sanitizedUsername)) {
      return NextResponse.json(
        { error: "Username must contain only lowercase letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Phone number validation (if provided)
    if (sanitizedPhoneNumber && !/^\+?[0-9]{10,15}$/.test(sanitizedPhoneNumber.replace(/[\s-]/g, ''))) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existingUserProfile = await prisma.userProfile.findUnique({
      where: { username: sanitizedUsername }
    });

    if (existingUserProfile) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Hash the password with a strong salt factor
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user with a transaction to ensure user and profile are created together
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: sanitizedName,
          email: sanitizedEmail,
          password: hashedPassword,
        },
      });

      // Create user profile
      await tx.userProfile.create({
        data: {
          userId: user.id,
          username: sanitizedUsername,
          bio: sanitizedBio || "No bio provided",
          phoneNumber: sanitizedPhoneNumber,
          readingStreak: 0,
          khatmsParticipated: 0,
          emailNotifications: true,
          language: "English",
          achievements: "[]"
        },
      });

      return user;
    });

    // Return success without sensitive info
    return NextResponse.json({
      success: true,
      id: result.id,
      name: result.name,
      email: result.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user", details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
} 
