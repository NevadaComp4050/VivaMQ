import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: { params: { unitId: string; assignmentId: string; submissionId: string } }
) {
  try {
    // First, fetch the submission to get the studentName
    const submission = await prisma.submission.findUnique({
      where: {
        id: params.submissionId,
        assignmentId: params.assignmentId,
      },
      select: {
        studentName: true,
        assignment: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Now, fetch the assignment with filtered vivas
    const assignmentWithVivas = await prisma.assignment.findUnique({
      where: {
        id: submission.assignment.id,
      },
      include: {
        vivas: {
          where: {
            studentName: submission.studentName,
          },
          include: {
            questions: true,
          },
        },
      },
    });

    if (assignmentWithVivas) {
      const responseData = {
        ...submission,
        questions: assignmentWithVivas.vivas[0]?.questions || [],
      };
      return NextResponse.json(responseData);
    }

    return NextResponse.json(
      { error: "Assignment not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the submission" },
      { status: 500 }
    );
  }
}
