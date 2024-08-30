// app/api/search/route.ts

import { NextResponse } from 'next/server';
import { searchData, SearchItem } from '~/lib/search-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results = searchData.filter((item) =>
    item.keywords.some((keyword) =>
      keyword.toLowerCase().includes(query.toLowerCase())
    ) ||
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({ results });
}