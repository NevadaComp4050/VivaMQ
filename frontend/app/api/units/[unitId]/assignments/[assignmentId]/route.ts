// app/api/units/[unitId]/assignments/[assignmentId]/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function GET(
  request: Request,
  { params }: { params: { unitId: string; assignmentId: string } }
) {
  const assignment = mockDatabase.assignments.find(
    (a) => a.id === params.assignmentId && a.unitId === params.unitId
  );
  if (assignment) {
    const submissions = mockDatabase.submissions.filter(
      (s) => s.assignmentId === assignment.id
    );
    return NextResponse.json({ ...assignment, submissions });
  }
  return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
}
