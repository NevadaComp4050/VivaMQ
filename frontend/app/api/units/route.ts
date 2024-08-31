// app/api/units/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function GET() {
  return NextResponse.json(mockDatabase.units);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const newUnit = { id: String(mockDatabase.units.length + 1), name };
  mockDatabase.units.push(newUnit);
  return NextResponse.json(newUnit, { status: 201 });
}
