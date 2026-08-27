import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const records = await prisma.telemetry.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: {
        collar: {
          select: { breed: true }
        }
      }
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Fetch telemetry error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
