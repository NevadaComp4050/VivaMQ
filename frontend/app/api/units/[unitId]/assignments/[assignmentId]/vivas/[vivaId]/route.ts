import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: { params: { unitId: string; assignmentId: string; vivaId: string } }
) {
  try {
    const viva = await prisma.viva.findUnique({
      where: {
        id: params.vivaId,
        assignmentId: params.assignmentId,
      },
      include: {
        questions: true,
      },
    });

    if (viva) {
      return NextResponse.json(viva);
    }
    return NextResponse.json({ error: "Viva not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching viva:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the viva" },
      { status: 500 }
    );
  }
}
