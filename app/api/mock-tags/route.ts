import { NextResponse } from 'next/server';
import { mockTags } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockTags);
}
