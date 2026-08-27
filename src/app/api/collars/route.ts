import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collars = await prisma.collar.findMany({
      include: {
        telemetry: {
          orderBy: { timestamp: 'desc' },
          take: 1, // Only return the most recent telemetry reading per collar
        },
      },
    });

    return NextResponse.json(collars);
  } catch (error) {
    console.error("Error fetching collars:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
