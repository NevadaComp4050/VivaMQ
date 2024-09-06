// app/api/vivas/[vivaId]/approve-questions/route.ts
import { NextResponse } from 'next/server'
import mockDatabase from '~/lib/mockDatabase'

export async function POST(request: Request, { params }: { params: { vivaId: string } }) {
  const viva = mockDatabase.vivas.find(v => v.id === params.vivaId)
  if (viva) {
    viva.status = 'Questions Approved'
    return NextResponse.json({ message: 'Questions approved successfully' })
  }
  return NextResponse.json({ error: 'Viva not found' }, { status: 404 })
}