// app/api/units/[unitId]/assignments/[assignmentId]/submissions/[submissionId]/route.ts
import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: { params: { unitId: string; assignmentId: string; submissionId: string } }
) {
  try {
    const submission = await prisma.submission.findUnique({
      where: {
        id: params.submissionId,
        assignmentId: params.assignmentId,
      },
      include: {
        questions: true,
        pdfSubmission: true,
      },
    });

    if (submission) {
      return NextResponse.json(submission);
    }
    return NextResponse.json(
      { error: "Submission not found" },
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
