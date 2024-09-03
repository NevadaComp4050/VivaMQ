// app/api/rubrics/route.ts
import { NextResponse } from 'next/server'
import mockDatabase from '~/lib/mockDatabase'

export async function GET() {
  return NextResponse.json(mockDatabase.rubrics)
}

export async function POST(request: Request) {
  const newRubric = await request.json()
  newRubric.id = (mockDatabase.rubrics.length + 1).toString()
  mockDatabase.rubrics.push(newRubric)
  return NextResponse.json(newRubric, { status: 201 })
}