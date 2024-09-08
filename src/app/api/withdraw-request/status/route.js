// app/api/withdraw-request/status/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import WithdrawRequest from '@/models/WithdrawRequest';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    // Check if a withdrawal request already exists for the user
    const existingRequest = await WithdrawRequest.findOne({ email });

    if (existingRequest) {
      return NextResponse.json({ exists: true }, { status: 200 });
    }

    return NextResponse.json({ exists: false }, { status: 200 });
  } catch (error) {
    console.error('Error checking withdrawal request status:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
