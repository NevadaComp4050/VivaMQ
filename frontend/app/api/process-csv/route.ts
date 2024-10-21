import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const text = await file.text();
  const records = parse(text, { columns: true, skip_empty_lines: true });

  const mapping: Record<string, string> = {};
  for (const record of records) {
    mapping[record.fileName] = record.studentId;
  }

  return NextResponse.json(mapping);
}