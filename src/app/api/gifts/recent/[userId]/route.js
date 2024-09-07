import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import Supporter from '@/models/Supporter';// Assuming you have a Gift model

export async function GET(req) {
  const token = req.cookies.get('authToken')?.value?.toString();

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Connect to MongoDB
    await dbConnect();

    // Find user by ID
    const user = await User.findById(payload._id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch recent gifts for the user
    const recentGifts = await Supporter.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10); // Adjust as needed
    const totalGifts = recentGifts.length; // Adjust if you need the actual total number of gifts

    return NextResponse.json({ gifts: recentGifts, totalGifts });
  } catch (error) {
    console.error('Error fetching recent gifts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
