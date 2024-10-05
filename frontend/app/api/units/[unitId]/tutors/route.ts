import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";
import { saltAndHashPassword } from "~/utils/password";

export async function GET(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const tutors = await prisma.user.findMany({
      where: {
        role: "TUTOR",
        units: {
          some: { id: params.unitId },
        },
      },
    });
    return NextResponse.json(tutors);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching tutors" },
      { status: 500 }
    );
  }
}


export async function POST(
  request: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const { name, email, phone, password } = await request.json();

    // Hash the password before storing it
    const hashedPassword = await saltAndHashPassword(password);

    const newTutor = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "TUTOR",
        units: {
          connect: { id: params.unitId },
        },
      },
    });
    return NextResponse.json(newTutor, { status: 201 });
  } catch (error) {
    console.error("Error creating tutor:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the tutor" },
      { status: 500 }
    );
  }
}
