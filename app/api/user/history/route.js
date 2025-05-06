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

    // Get user's completed sections
    const completedSections = await prisma.completedSection.findMany({
      where: {
        userId: user.id
      },
      include: {
        section: {
          select: {
            paraNumber: true,
            rukuNumber: true
          }
        },
        khatm: {
          select: {
            id: true,
            khatmNumber: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    // Format the response data
    const completions = completedSections.map(completion => ({
      paraNumber: completion.section.paraNumber,
      rukuNumber: completion.section.rukuNumber,
      khatmId: completion.khatm.id,
      khatmNumber: completion.khatm.khatmNumber,
      completedAt: completion.completedAt
    }));

    return NextResponse.json({
      completions
    });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
} 
