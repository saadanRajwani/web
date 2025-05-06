import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Add these exports for static generation
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  try {
    // Get current khatm
    const activeKhatm = await prisma.khatm.findFirst({
      where: { isActive: true }
    });

    if (!activeKhatm) {
      return NextResponse.json({ 
        error: "No active Khatm found" 
      }, { status: 404 });
    }

    // Find sections for paras 3 and 6
    const paras = [3, 6];
    const sections = await prisma.quranSection.findMany({
      where: {
        paraNumber: { in: paras },
        rukuNumber: null
      }
    });

    if (sections.length === 0) {
      return NextResponse.json({ 
        error: "Sections not found" 
      }, { status: 404 });
    }

    // Create a test user if it doesn't exist
    let testUser = await prisma.user.findUnique({
      where: { email: "test@example.com" }
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: "hashed_password_would_go_here"
        }
      });
    }

    // Create user progress records for the sections (assigned but not completed)
    const progressRecords = [];
    for (const section of sections) {
      const existing = await prisma.userProgress.findUnique({
        where: {
          userId_sectionId: {
            userId: testUser.id,
            sectionId: section.id
          }
        }
      });

      if (!existing) {
        const record = await prisma.userProgress.create({
          data: {
            userId: testUser.id,
            sectionId: section.id,
            isCompleted: false,
            completedAt: null
          }
        });
        progressRecords.push(record);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${progressRecords.length} test progress records for paras: ${paras.join(', ')}`,
      takenParas: paras
    });
  } catch (error) {
    console.error("Error creating test data:", error);
    return NextResponse.json({ 
      error: "Failed to create test data" 
    }, { status: 500 });
  }
} 
