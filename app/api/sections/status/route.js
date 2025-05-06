import { NextResponse } from "next/server";

// Add these exports for static generation
export const dynamic = "force-static";
export const revalidate = false;

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import authOptions from "@/app/api/auth/[...nextauth]/auth";

// Force dynamic to fix the export errors
export const dynamic = 'force-dynamic';

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

    // Find all sections from the QuranSection table
    const allSections = await prisma.quranSection.findMany({
      where: {
        rukuNumber: null, // Just get full paras, not individual rukus
      },
      select: {
        id: true,
        paraNumber: true,
      }
    });

    // Get all user progress records to identify assigned paras
    const userProgressRecords = await prisma.userProgress.findMany({
      where: {
        isCompleted: false, // Only get in-progress (not completed) assignments
      },
      include: {
        section: {
          select: {
            paraNumber: true,
          }
        }
      }
    });

    // Get all completed sections
    const completedSections = await prisma.completedSection.findMany({
      where: { 
        khatmId: activeKhatm.id 
      },
      include: {
        section: {
          select: {
            paraNumber: true,
          }
        }
      }
    });

    // Create response structure with all para numbers
    const paraStatus = {};
    
    // Initialize all paras as available
    allSections.forEach(section => {
      if (section.paraNumber) {
        paraStatus[section.paraNumber] = {
          paraNumber: section.paraNumber,
          isAssigned: false,
          isCompleted: false
        };
      }
    });
    
    // Mark assigned (taken) paras
    userProgressRecords.forEach(record => {
      if (record.section && record.section.paraNumber) {
        const paraNumber = record.section.paraNumber;
        if (paraStatus[paraNumber]) {
          paraStatus[paraNumber].isAssigned = true;
        }
      }
    });
    
    // Mark completed paras
    completedSections.forEach(completed => {
      if (completed.section && completed.section.paraNumber) {
        const paraNumber = completed.section.paraNumber;
        if (paraStatus[paraNumber]) {
          paraStatus[paraNumber].isCompleted = true;
          // If it's completed, it's no longer just assigned
          paraStatus[paraNumber].isAssigned = false;
        }
      }
    });
    
    // Convert the object to an array for the response
    const sections = Object.values(paraStatus);

    // Debug info
    console.log("API Response: Taken paras:", sections.filter(s => s.isAssigned).map(s => s.paraNumber));
    console.log("API Response: Completed paras:", sections.filter(s => s.isCompleted).map(s => s.paraNumber));

    return NextResponse.json({ sections });
  } catch (error) {
    console.error("Error fetching section status:", error);
    return NextResponse.json({ 
      error: "Failed to fetch section status" 
    }, { status: 500 });
  }
} 
