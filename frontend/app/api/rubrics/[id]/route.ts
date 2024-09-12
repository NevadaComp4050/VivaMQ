import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rubric = await prisma.rubric.findUnique({
      where: { id: params.id },
      include: { criteria: true },
    });
    if (rubric) {
      return NextResponse.json(rubric);
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching rubric:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the rubric" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedRubric = await request.json();
    const rubric = await prisma.rubric.update({
      where: { id: params.id },
      data: updatedRubric,
      include: { criteria: true },
    });
    return NextResponse.json(rubric);
  } catch (error) {
    console.error("Error updating rubric:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the rubric" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.rubric.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting rubric:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the rubric" },
      { status: 500 }
    );
  }
}
