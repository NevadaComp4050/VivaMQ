import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.assignmentId },
      include: { submissionRecords: true },
    });

    if (assignment) {
      return NextResponse.json(assignment);
    }
    return NextResponse.json(
      { error: "Assignment not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the assignment" },
      { status: 500 }
    );
  }
}
