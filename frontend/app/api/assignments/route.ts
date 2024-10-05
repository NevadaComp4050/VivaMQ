import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany();
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching assignments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { unitId, name, description, dueDate } = await request.json();
    const newAssignment = await prisma.assignment.create({
      data: {
        unitId,
        name,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the assignment" },
      { status: 500 }
    );
  }
}
