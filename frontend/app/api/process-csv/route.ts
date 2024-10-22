// process-csv API code
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
  const duplicates: string[] = [];

  for (const record of records) {
    const fileName = record.fileName?.trim().toLowerCase();
    const studentId = record.studentId?.trim();

    if (!fileName || !studentId) continue;

    if (mapping[fileName]) {
      duplicates.push(record.fileName);
    } else {
      mapping[fileName] = studentId;
    }
  }

  if (duplicates.length > 0) {
    return NextResponse.json({ error: 'Duplicate entries found', duplicates }, { status: 400 });
  }

  return NextResponse.json(mapping);
}
