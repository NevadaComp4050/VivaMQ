// app/api/vivas/[vivaId]/questions/[questionId]/regenerate/route.ts
import { NextResponse } from "next/server";
import mockDatabase from "~/lib/mockDatabase";

export async function POST(
  request: Request,
  { params }: { params: { vivaId: string; questionId: string } }
) {
  const viva = mockDatabase.vivas.find((v) => v.id === params.vivaId);
  if (viva) {
    const questionIndex = viva.questions.findIndex(
      (q) => q.id === params.questionId
    );
    if (questionIndex !== -1) {
      // In a real application, this would call an AI service to generate a new question
      const newQuestion = {
        ...viva.questions[questionIndex],
        text: `Regenerated question ${Date.now()}`,
      };
      viva.questions[questionIndex] = newQuestion;
      return NextResponse.json(newQuestion);
    }
  }
  return NextResponse.json({ error: "Question not found" }, { status: 404 });
}
