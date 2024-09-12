import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { unitId: string; assignmentId: string } }
) {
  try {
    const submissions = await prisma.submission.findMany({
      where: { assignmentId: params.assignmentId },
      include: { pdfSubmission: true },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching submissions" },
      { status: 500 }
    );
  }
}