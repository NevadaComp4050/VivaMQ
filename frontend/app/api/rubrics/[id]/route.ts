import { NextResponse } from 'next/server'

let rubrics = [
  { id: '1', name: "Database Normalization Rubric", unit: "1", assignment: "1", year: "2024", session: "S1", criteria: [] },
  { id: '2', name: "Software Design Patterns Rubric", unit: "2", assignment: "2", year: "2024", session: "S1", criteria: [] },
  { id: '3', name: "Machine Learning Algorithms Rubric", unit: "3", assignment: "3", year: "2023", session: "S2", criteria: [] },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const rubric = rubrics.find(r => r.id === params.id)
  if (rubric) {
    return NextResponse.json(rubric)
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedRubric = await request.json()
  const index = rubrics.findIndex(r => r.id === params.id)
  if (index !== -1) {
    rubrics[index] = { ...rubrics[index], ...updatedRubric }
    return NextResponse.json(rubrics[index])
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = rubrics.findIndex(r => r.id === params.id)
  if (index !== -1) {
    rubrics.splice(index, 1)
    return NextResponse.json({ message: 'Deleted successfully' })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}