// File: app/api/units/[unitId]/assignments/[assignmentId]/submissions/[submissionId]/route.ts

import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function GET(
  request: Request,
  {
    params,
  }: { params: { unitId: string; assignmentId: string; submissionId: string } }
) {
  const submission = mockDatabase.submissions.find(
    (s) =>
      s.id === params.submissionId && s.assignmentId === params.assignmentId
  );

  if (submission) {
    // Find the corresponding viva for this submission
    const viva = mockDatabase.vivas.find(
      (v) =>
        v.assignmentId === params.assignmentId &&
        v.studentName === submission.studentName
    );

    // Combine submission and viva data
    const responseData = {
      ...submission,
      questions: viva ? viva.questions : [],
    };

    return NextResponse.json(responseData);
  }

  return NextResponse.json({ error: "Submission not found" }, { status: 404 });
}
