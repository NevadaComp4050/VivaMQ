// app/api/units/[unitId]/tutors/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function GET(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  // In a real application, you would have a many-to-many relationship between units and tutors
  // For this mock, we'll just return all tutors
  return NextResponse.json(mockDatabase.tutors);
}

export async function POST(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  const { name, email, phone } = await request.json();
  const newTutor = {
    id: String(mockDatabase.tutors.length + 1),
    name,
    email,
    phone,
  };
  mockDatabase.tutors.push(newTutor);
  return NextResponse.json(newTutor, { status: 201 });
}
