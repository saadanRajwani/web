import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";

// Add these exports for static generation
export const dynamic = "force-static";
export const revalidate = false;

// GET user's progress
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        userProgress: {
          include: {
            section: true,
          },
        },
        completedSections: {
          include: {
            section: true,
            khatm: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userProgress: user.userProgress,
      completedSections: user.completedSections,
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch user progress" },
      { status: 500 }
    );
  }
}

// POST to update user's progress
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { paraNumber, rukuNumber, completed } = body;

    if (!paraNumber) {
      return NextResponse.json(
        { error: "Para number is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find the section
    let section = await prisma.quranSection.findFirst({
      where: {
        paraNumber,
        rukuNumber: rukuNumber || null,
      },
    });

    if (!section) {
      // If ruku-specific section doesn't exist, create it
      if (rukuNumber) {
        section = await prisma.quranSection.create({
          data: {
            paraNumber,
            rukuNumber,
            name: `Para ${paraNumber} (Ruku ${rukuNumber})`,
            totalVerses: 0, // Would be populated with actual data
          },
        });
      } else {
        return NextResponse.json(
          { error: "Section not found" },
          { status: 404 }
        );
      }
    }

    // Get active khatm
    const activeKhatm = await prisma.khatm.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!activeKhatm) {
      return NextResponse.json(
        { error: "No active Khatm found" },
        { status: 404 }
      );
    }

    // Find or create user progress record
    let userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_sectionId: {
          userId: user.id,
          sectionId: section.id,
        },
      },
    });

    if (!userProgress) {
      userProgress = await prisma.userProgress.create({
        data: {
          userId: user.id,
          sectionId: section.id,
          isCompleted: !!completed,
          completedAt: completed ? new Date() : null,
        },
      });
    } else {
      userProgress = await prisma.userProgress.update({
        where: {
          id: userProgress.id,
        },
        data: {
          isCompleted: !!completed,
          completedAt: completed ? new Date() : null,
        },
      });
    }

    // If completed, create a completed section record
    if (completed) {
      try {
        // First, check if this user already has a completed section for this para
        const existingCompletion = await prisma.completedSection.findFirst({
          where: {
            userId: user.id,
            section: {
              paraNumber: paraNumber,
              rukuNumber: rukuNumber || null
            },
            khatmId: activeKhatm.id
          }
        });

        if (!existingCompletion) {
          // Create a new completion record
          await prisma.completedSection.create({
            data: {
              userId: user.id,
              sectionId: section.id,
              khatmId: activeKhatm.id,
              completedAt: new Date(),
            },
          });
          
          // Update khatm statistics
          await prisma.khatm.update({
            where: {
              id: activeKhatm.id,
            },
            data: {
              sectionsCompleted: {
                increment: 1,
              },
              totalParticipants: {
                increment: 0, // Only increment if this is the first section completed by this user
              },
            },
          });
          
          console.log(`User ${user.id} marked para ${paraNumber} as completed`);
        } else {
          console.log(`User ${user.id} already completed para ${paraNumber}`);
        }
      } catch (e) {
        console.error("Error in completion recording:", e);
        // Even if this part fails, we'll still return success for the progress update
      }
    }

    return NextResponse.json({
      success: true,
      progress: userProgress,
    });
  } catch (error) {
    console.error("Error updating user progress:", error);
    return NextResponse.json(
      { error: "Failed to update user progress" },
      { status: 500 }
    );
  }
} 
