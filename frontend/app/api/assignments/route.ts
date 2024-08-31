// app/api/assignments/route.ts
import { NextResponse } from 'next/server';
import mockDatabase from "~/lib/mockDatabase";

export async function GET() {
  return NextResponse.json(mockDatabase.assignments);
}

export async function POST(request: Request) {
  const { unitId, name } = await request.json();
  const newAssignment = { 
    id: String(mockDatabase.assignments.length + 1), 
    unitId, 
    name 
  };
  mockDatabase.assignments.push(newAssignment);
  return NextResponse.json(newAssignment, { status: 201 });
}