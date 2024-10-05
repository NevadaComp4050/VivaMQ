import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { unitId: string; assignmentId: string } }
) {
  try {
    const vivas = await prisma.viva.findMany({
      where: { assignmentId: params.assignmentId },
      include: { questions: true },
    });
    return NextResponse.json(vivas);
  } catch (error) {
    console.error("Error fetching vivas:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching vivas" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { unitId: string; assignmentId: string } }
) {
  try {
    const { studentName } = await request.json();
    const newViva = await prisma.viva.create({
      data: {
        assignmentId: params.assignmentId,
        studentName,
        status: "Scheduled",
      },
    });
    return NextResponse.json(newViva, { status: 201 });
  } catch (error) {
    console.error("Error creating viva:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the viva" },
      { status: 500 }
    );
  }
}
