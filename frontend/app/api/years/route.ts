// app/api/years/route.ts
import { NextResponse } from 'next/server'
import mockDatabase from '~/lib/mockDatabase'

export async function GET() {
  return NextResponse.json(mockDatabase.years)
}

export async function POST(request: Request) {
  const { year } = await request.json()
  if (!mockDatabase.years.includes(year)) {
    mockDatabase.years.push(year)
    mockDatabase.years.sort((a, b) => parseInt(b) - parseInt(a))
  }
  return NextResponse.json(year, { status: 201 })
}