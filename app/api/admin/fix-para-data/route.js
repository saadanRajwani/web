import { NextResponse } from "next/server";

// Add these exports for static generation
export const dynamic = "force-static";
export const revalidate = false;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get active khatm
    const activeKhatm = await prisma.khatm.findFirst({
      where: { isActive: true }
    });

    if (!activeKhatm) {
      return NextResponse.json({ 
        error: "No active Khatm found" 
      }, { status: 404 });
    }

    // 2. Find all user progress records
    const userProgressRecords = await prisma.userProgress.findMany({
      include: {
        section: true
      }
    });

    // Find and delete incorrect user progress records (for paras 1 and 8)
    const incorrectParas = [1, 8];
    const recordsToDelete = userProgressRecords.filter(record => 
      record.section && 
      incorrectParas.includes(record.section.paraNumber) &&
      !record.isCompleted
    );

    // Delete incorrect progress records
    for (const record of recordsToDelete) {
      await prisma.userProgress.delete({
        where: { id: record.id }
      });
    }

    // Log results
    console.log(`Deleted ${recordsToDelete.length} incorrect progress records for paras: ${incorrectParas.join(', ')}`);

    return NextResponse.json({
      success: true,
      message: `Fixed para data. Deleted ${recordsToDelete.length} incorrect records.`
    });
  } catch (error) {
    console.error("Error fixing para data:", error);
    return NextResponse.json({ 
      error: "Failed to fix para data" 
    }, { status: 500 });
  }
} 
