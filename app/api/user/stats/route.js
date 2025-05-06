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

    // Get current khatm
    const currentKhatm = await prisma.khatm.findFirst({
      where: { isActive: true }
    });

    if (!currentKhatm) {
      return NextResponse.json(
        { error: "No active khatm found" },
        { status: 404 }
      );
    }

    // Count user's completed sections for this khatm
    const completedSections = await prisma.completedSection.count({
      where: {
        userId: user.id,
        khatmId: currentKhatm.id
      }
    });

    // Calculate user's percentile (simplified approach for now)
    // For a proper percentile, we would need to get statistics from all users
    let percentile = "0%";
    
    if (completedSections > 0) {
      // Get all users who completed at least one section
      const allUsers = await prisma.user.findMany({
        where: {
          completedSections: {
            some: {
              khatmId: currentKhatm.id
            }
          }
        },
        include: {
          _count: {
            select: {
              completedSections: {
                where: {
                  khatmId: currentKhatm.id
                }
              }
            }
          }
        }
      });
      
      // Sort users by number of completed sections
      allUsers.sort((a, b) => 
        b._count.completedSections - a._count.completedSections
      );
      
      // Find user's position
      const userPosition = allUsers.findIndex(u => u.id === user.id) + 1;
      
      // Calculate percentile
      if (userPosition > 0) {
        const totalUsers = allUsers.length;
        const calculatedPercentile = Math.round(((totalUsers - userPosition) / totalUsers) * 100);
        percentile = `Top ${calculatedPercentile}%`;
        
        // If user is in the top positions, give a special label
        if (userPosition <= 3 && totalUsers > 3) {
          if (userPosition === 1) percentile = "Top 1%";
          else if (userPosition === 2) percentile = "Top 5%";
          else if (userPosition === 3) percentile = "Top 10%";
        }
      }
    }

    return NextResponse.json({
      completedSections,
      percentile
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
} 
