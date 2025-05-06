import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Force dynamic to fix the export errors
export const dynamic = 'force-dynamic'; 