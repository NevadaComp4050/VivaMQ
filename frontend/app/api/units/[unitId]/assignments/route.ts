// app/api/units/[unitId]/assignments/route.ts
import { NextResponse } from 'next/server'
import mockDatabase from '~/lib/mockDatabase'

export async function GET(request: Request, { params }: { params: { unitId: string } }) {
  const unitAssignments = mockDatabase.assignments.filter(a => a.unitId === params.unitId)
  return NextResponse.json(unitAssignments)
}

export async function POST(request: Request, { params }: { params: { unitId: string } }) {
  const { name } = await request.json()
  const newAssignment = { id: String(mockDatabase.assignments.length + 1), unitId: params.unitId, name }
  mockDatabase.assignments.push(newAssignment)
  return NextResponse.json(newAssignment, { status: 201 })
}