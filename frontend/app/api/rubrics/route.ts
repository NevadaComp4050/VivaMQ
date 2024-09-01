import { NextResponse } from 'next/server'

let rubrics = [
  { id: '1', name: "Database Normalization Rubric", unit: "1", assignment: "1", year: "2024", session: "S1", criteria: [] },
  { id: '2', name: "Software Design Patterns Rubric", unit: "2", assignment: "2", year: "2024", session: "S1", criteria: [] },
  { id: '3', name: "Machine Learning Algorithms Rubric", unit: "3", assignment: "3", year: "2023", session: "S2", criteria: [] },
]

export async function GET() {
  return NextResponse.json(rubrics)
}

export async function POST(request: Request) {
  const newRubric = await request.json()
  newRubric.id = (rubrics.length + 1).toString()
  rubrics.push(newRubric)
  return NextResponse.json(newRubric, { status: 201 })
}