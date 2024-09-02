// app/api/vivas/[vivaId]/mark-complete/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function POST(
  request: Request,
  { params }: { params: { vivaId: string } }
) {
  const viva = mockDatabase.vivas.find((v) => v.id === params.vivaId);
  if (viva) {
    viva.status = "Completed";
    return NextResponse.json({ message: "Viva marked as complete" });
  }
  return NextResponse.json({ error: "Viva not found" }, { status: 404 });
}
