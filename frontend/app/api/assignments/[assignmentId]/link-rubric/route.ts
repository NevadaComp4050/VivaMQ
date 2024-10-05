import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const { rubricId } = await request.json();
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.assignmentId },
    });
    const rubric = await prisma.rubric.findUnique({
      where: { id: rubricId },
    });

    if (assignment && rubric) {
      await prisma.rubric.update({
        where: { id: rubricId },
        data: { assignmentId: params.assignmentId },
      });
      return NextResponse.json({ message: "Rubric linked successfully" });
    }
    return NextResponse.json(
      { error: "Assignment or Rubric not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error linking rubric:", error);
    return NextResponse.json(
      { error: "An error occurred while linking the rubric" },
      { status: 500 }
    );
  }
}
