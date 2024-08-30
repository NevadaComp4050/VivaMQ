import { NextResponse } from 'next/server'

// Mock database
let years = ['2023', '2024']

export async function GET() {
  return NextResponse.json(years)
}

export async function POST(request: Request) {
  const { year } = await request.json()
  if (!years.includes(year)) {
    years.push(year)
    years.sort((a, b) => parseInt(b) - parseInt(a))
  }
  return NextResponse.json(year, { status: 201 })
}