// app/api/units/[unitId]/route.ts

import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function GET(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  const unit = mockDatabase.units.find((u) => u.id === params.unitId);
  if (unit) {
    return NextResponse.json(unit);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  const updatedUnit = await request.json();
  const index = mockDatabase.units.findIndex((u) => u.id === params.unitId);
  if (index !== -1) {
    mockDatabase.units[index] = {
      ...mockDatabase.units[index],
      ...updatedUnit,
    };
    return NextResponse.json(mockDatabase.units[index]);
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  const index = mockDatabase.units.findIndex((u) => u.id === params.unitId);
  if (index !== -1) {
    mockDatabase.units.splice(index, 1);
    return NextResponse.json({ message: "Deleted successfully" });
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
