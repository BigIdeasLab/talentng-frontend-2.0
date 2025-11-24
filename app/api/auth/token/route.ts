import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies(); // This needs to be awaited
  const accessToken = cookieStore.get('accessToken')?.value;

  if (accessToken) {
    return NextResponse.json({ accessToken });
  } else {
    return NextResponse.json({ accessToken: null }, { status: 401 });
  }
}
