import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const path = join(process.cwd(), 'uploads', `${id}.pdf`);

  try {
    const file = await readFile(path);
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}