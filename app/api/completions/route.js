import { NextResponse } from "next/server";

// Add these exports for static generation
export const dynamic = "force-static";
export const revalidate = false;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Force dynamic to fix the export errors
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch the most recent completed sections
    const completions = await prisma.completedSection.findMany({
      orderBy: {
        completedAt: 'desc'
      },
      take: 10, // Get only 10 recent completions
      include: {
        user: {
          select: {
            name: true
          }
        },
        section: {
          select: {
            paraNumber: true,
            rukuNumber: true
          }
        }
      }
    });

    return NextResponse.json({ completions });
  } catch (error) {
    console.error("Error fetching completions:", error);
    return NextResponse.json(
      { error: "Failed to fetch completions" },
      { status: 500 }
    );
  }
} 
