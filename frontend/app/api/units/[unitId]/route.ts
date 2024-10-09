import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id: params.unitId },
      include: { assignments: true },
    });
    if (unit) {
      return NextResponse.json(unit);
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching unit:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the unit" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const updatedUnit = await request.json();
    const unit = await prisma.unit.update({
      where: { id: params.unitId },
      data: updatedUnit,
    });
    return NextResponse.json(unit);
  } catch (error) {
    console.error("Error updating unit:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the unit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    await prisma.unit.delete({
      where: { id: params.unitId },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting unit:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the unit" },
      { status: 500 }
    );
  }
}
