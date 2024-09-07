// app/api/auth/user/route.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function GET(req) {
  const token = req.cookies.get('authToken')?.value?.toString();

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Connect to the MongoDB client
    await dbConnect();
    const user = await User.findById(payload._id); // Assuming User is your model

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
