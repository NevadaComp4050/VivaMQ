import { NextResponse } from 'next/server'

// Mock database
let units = [
  { id: '1', name: 'Introduction to Programming' },
  { id: '2', name: 'Web Development' },
]

export async function GET() {
  return NextResponse.json(units)
}

export async function POST(request: Request) {
  const { name } = await request.json()
  const newUnit = { id: String(units.length + 1), name }
  units.push(newUnit)
  return NextResponse.json(newUnit, { status: 201 })
}