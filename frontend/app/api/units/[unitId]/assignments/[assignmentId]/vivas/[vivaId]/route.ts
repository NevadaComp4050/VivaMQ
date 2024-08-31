// app/api/units/[unitId]/assignments/[assignmentId]/vivas/[vivaId]/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function GET(
  request: Request,
  {
    params,
  }: { params: { unitId: string; assignmentId: string; vivaId: string } }
) {
  const viva = mockDatabase.vivas.find(
    (v) => v.id === params.vivaId && v.assignmentId === params.assignmentId
  );
  if (viva) {
    return NextResponse.json(viva);
  }
  return NextResponse.json({ error: "Viva not found" }, { status: 404 });
}
