import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function GET(req) {
  const token = req.cookies.get('authToken')?.value?.toString();
    
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    verifyToken(token);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
