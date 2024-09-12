import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function GET() {
  try {
    const rubrics = await prisma.rubric.findMany({
      include: { criteria: true },
    });
    return NextResponse.json(rubrics);
  } catch (error) {
    console.error("Error fetching rubrics:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching rubrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newRubric = await request.json();
    const createdRubric = await prisma.rubric.create({
      data: {
        ...newRubric,
        criteria: {
          create: newRubric.criteria,
        },
      },
      include: { criteria: true },
    });
    return NextResponse.json(createdRubric, { status: 201 });
  } catch (error) {
    console.error("Error creating rubric:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the rubric" },
      { status: 500 }
    );
  }
}
