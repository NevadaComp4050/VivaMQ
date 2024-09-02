// app/api/tutors/[id]/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tutor = mockDatabase.tutors.find((t) => t.id === params.id);
  if (tutor) {
    return NextResponse.json(tutor);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const updatedTutor = await request.json();
  const index = mockDatabase.tutors.findIndex((t) => t.id === params.id);
  if (index !== -1) {
    mockDatabase.tutors[index] = {
      ...mockDatabase.tutors[index],
      ...updatedTutor,
    };
    return NextResponse.json(mockDatabase.tutors[index]);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = mockDatabase.tutors.findIndex((t) => t.id === params.id);
  if (index !== -1) {
    mockDatabase.tutors.splice(index, 1);
    return NextResponse.json({ message: "Deleted successfully" });
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
