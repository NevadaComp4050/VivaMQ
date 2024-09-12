import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET() {
  try {
    const units = await prisma.unit.findMany({
      include: { assignments: true },
    });
    return NextResponse.json(units);
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching units" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, code, year, session, convenorId } = await request.json();
    const newUnit = await prisma.unit.create({
      data: {
        name,
        code,
        year,
        session,
        convenorId,
      },
    });
    return NextResponse.json(newUnit, { status: 201 });
  } catch (error) {
    console.error("Error creating unit:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the unit" },
      { status: 500 }
    );
  }
}
