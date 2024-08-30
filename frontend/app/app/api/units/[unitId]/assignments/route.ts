import { NextResponse } from 'next/server'

// Mock database
let assignments = [
  { id: '1', unitId: '1', name: 'Programming Basics Quiz' },
  { id: '2', unitId: '1', name: 'Simple Calculator Project' },
  { id: '3', unitId: '2', name: 'HTML/CSS Portfolio' },
]

export async function GET(request: Request, { params }: { params: { unitId: string } }) {
  const unitAssignments = assignments.filter(a => a.unitId === params.unitId)
  return NextResponse.json(unitAssignments)
}

export async function POST(request: Request, { params }: { params: { unitId: string } }) {
  const { name } = await request.json()
  const newAssignment = { id: String(assignments.length + 1), unitId: params.unitId, name }
  assignments.push(newAssignment)
  return NextResponse.json(newAssignment, { status: 201 })
}