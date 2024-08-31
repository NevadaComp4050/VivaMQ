import { NextResponse } from "next/server";
import mockDatabase, { Tutor } from "~/lib/mockDatabase";

export async function GET() {
  return NextResponse.json(mockDatabase.tutors);
}

export async function POST(request: Request) {
  const { name, email, phone } = await request.json();
  const newTutor: Tutor = {
    id: String(mockDatabase.tutors.length + 1),
    name,
    email,
    phone,
  };
  mockDatabase.tutors.push(newTutor);
  return NextResponse.json(newTutor, { status: 201 });
}
