import { NextResponse } from 'next/server'

const assignments = {
  '1': [
    { id: '1', name: "Database Normalization Assignment" },
    { id: '2', name: "Query Optimization Project" },
  ],
  '2': [
    { id: '3', name: "Design Patterns Implementation" },
    { id: '4', name: "Agile Development Case Study" },
  ],
  '3': [
    { id: '5', name: "Neural Network Implementation" },
    { id: '6', name: "Data Preprocessing Techniques" },
  ],
}

export async function GET(request: Request, { params }: { params: { unitId: string } }) {
  const unitAssignments = assignments[params.unitId as keyof typeof assignments] || []
  return NextResponse.json(unitAssignments)
}