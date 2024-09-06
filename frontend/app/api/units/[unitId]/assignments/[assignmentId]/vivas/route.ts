// app/api/units/[unitId]/assignments/[assignmentId]/vivas/route.ts
import { NextResponse } from 'next/server'
import mockDatabase from '~/lib/mockDatabase'

export async function GET(request: Request, { params }: { params: { unitId: string, assignmentId: string } }) {
  const vivas = mockDatabase.vivas.filter(v => v.assignmentId === params.assignmentId)
  return NextResponse.json(vivas)
}

export async function POST(request: Request, { params }: { params: { unitId: string, assignmentId: string } }) {
  const { studentName } = await request.json()
  const newViva = {
    id: String(mockDatabase.vivas.length + 1),
    assignmentId: params.assignmentId,
    studentName,
    status: 'Scheduled',
    questions: []
  }
  mockDatabase.vivas.push(newViva)
  return NextResponse.json(newViva, { status: 201 })
}