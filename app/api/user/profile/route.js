import { NextResponse } from "next/server";

// Add these exports for static generation
export const dynamic = "force-static";
export const revalidate = false;

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import authOptions from "@/app/api/auth/[...nextauth]/auth";

// Force dynamic to fix the headers/cookies warning
export const dynamic = 'force-dynamic';

// GET user profile data
export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find user profile data
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId: user.id
      }
    });

    if (!userProfile) {
      // Create a default profile if it doesn't exist
      const newProfile = await prisma.userProfile.create({
        data: {
          userId: user.id,
          username: `user_${user.id.substring(0, 8)}`,
          bio: "No bio provided",
          readingStreak: 0,
          khatmsParticipated: 1,
          emailNotifications: true,
          language: "English",
          achievements: "[]"
        }
      });

      return NextResponse.json(newProfile);
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(req) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get the request body
    const body = await req.json();
    
    // Validate the request data
    const { username, bio, emailNotifications, language } = body;
    
    if (username && username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    // Update the user profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: {
        userId: user.id
      },
      update: {
        username: username,
        bio: bio,
        emailNotifications: emailNotifications,
        language: language
      },
      create: {
        userId: user.id,
        username: username || `user_${user.id.substring(0, 8)}`,
        bio: bio || "No bio provided",
        readingStreak: 0,
        khatmsParticipated: 1,
        emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
        language: language || "English",
        achievements: "[]"
      }
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
} 
