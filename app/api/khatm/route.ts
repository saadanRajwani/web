import { NextResponse } from "next/server";

// Add these exports for static generation
export const dynamic = "force-static";
export const revalidate = false;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET current khatm information
export async function GET() {
  try {
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

    return NextResponse.json(activeKhatm);
  } catch (error) {
    console.error("Error fetching khatm:", error);
    return NextResponse.json(
      { error: "Failed to fetch khatm information" },
      { status: 500 }
    );
  }
}

// POST to update khatm goal type (day, week, month)
export async function POST(req: Request) {
  try {
    const { goalType } = await req.json();

    if (!goalType || !["day", "week", "month"].includes(goalType)) {
      return NextResponse.json(
        { error: "Invalid goal type. Must be day, week, or month" },
        { status: 400 }
      );
    }

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

    // Calculate new end date based on goal type
    let newEndDate = new Date();
    if (goalType === "day") {
      newEndDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (goalType === "week") {
      newEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else {
      newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const updatedKhatm = await prisma.khatm.update({
      where: {
        id: activeKhatm.id,
      },
      data: {
        goalType,
        endDate: newEndDate,
      },
    });

    return NextResponse.json(updatedKhatm);
  } catch (error) {
    console.error("Error updating khatm:", error);
    return NextResponse.json(
      { error: "Failed to update khatm information" },
      { status: 500 }
    );
  }
} 
