// app/api/generate-rubric/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { criteria } = await request.json();

  // This is a mock implementation. Call the AI service here.
  const generatedCriteria = criteria.map(
    (criterion: { name: string; marks: number }) => ({
      ...criterion,
      descriptors: {
        F: `Fails to demonstrate understanding of ${criterion.name.toLowerCase()}.`,
        P: `Shows basic understanding of ${criterion.name.toLowerCase()}.`,
        C: `Demonstrates good understanding of ${criterion.name.toLowerCase()}.`,
        D: `Exhibits thorough understanding and application of ${criterion.name.toLowerCase()}.`,
        HD: `Demonstrates exceptional mastery and innovative application of ${criterion.name.toLowerCase()}.`,
      },
    })
  );

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(generatedCriteria);
}