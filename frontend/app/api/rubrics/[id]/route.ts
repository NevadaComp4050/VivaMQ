// app/api/rubrics/[id]/route.ts
import { NextResponse } from 'next/server'
import mockDatabase from '~/lib/mockDatabase'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const rubric = mockDatabase.rubrics.find(r => r.id === params.id)
  if (rubric) {
    return NextResponse.json(rubric)
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedRubric = await request.json()
  const index = mockDatabase.rubrics.findIndex(r => r.id === params.id)
  if (index !== -1) {
    mockDatabase.rubrics[index] = { ...mockDatabase.rubrics[index], ...updatedRubric }
    return NextResponse.json(mockDatabase.rubrics[index])
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = mockDatabase.rubrics.findIndex(r => r.id === params.id)
  if (index !== -1) {
    mockDatabase.rubrics.splice(index, 1)
    return NextResponse.json({ message: 'Deleted successfully' })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}