// app/api/assignments/[assignmentId]/link-rubric/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function POST(
  request: Request,
  { params }: { params: { assignmentId: string } }
) {
  const { rubricId } = await request.json();
  const assignment = mockDatabase.assignments.find(
    (a) => a.id === params.assignmentId
  );
  const rubric = mockDatabase.rubrics.find((r) => r.id === rubricId);

  if (assignment && rubric) {
    rubric.assignment = params.assignmentId;
    return NextResponse.json({ message: "Rubric linked successfully" });
  }
  return NextResponse.json(
    { error: "Assignment or Rubric not found" },
    { status: 404 }
  );
}