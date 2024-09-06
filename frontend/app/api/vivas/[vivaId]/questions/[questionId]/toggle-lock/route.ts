// app/api/vivas/[vivaId]/questions/[questionId]/toggle-lock/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function POST(
  request: Request,
  { params }: { params: { vivaId: string; questionId: string } }
) {
  const viva = mockDatabase.vivas.find((v) => v.id === params.vivaId);
  if (viva) {
    const question = viva.questions.find((q) => q.id === params.questionId);
    if (question) {
      question.status = question.status === "Locked" ? "Unlocked" : "Locked";
      return NextResponse.json(question);
    }
  }
  return NextResponse.json({ error: "Question not found" }, { status: 404 });
}
