import dbConnect from '@/utils/dbConnect';
import Supporter from '@/models/Supporter';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  // Destructure userId from params
  const { userId } = params;

  // Connect to the database
  await dbConnect();

  try {
    // Find gifts related to the user and filter out private ones
    const publicGifts = await Supporter.find({
      userId,
      isPrivate: false, // Only return non-private gifts
    }).select('-senderEmail') // Exclude senderEmail field
    .sort({ createdAt: -1 }); // Sort by most recent first

    // If no gifts found, return a 404 response
    if (!publicGifts || publicGifts.length === 0) {
      return NextResponse.json({ success: false, message: 'No gifts found' }, { status: 404 });
    }

    // Return the gifts data in JSON format
    return NextResponse.json({ success: true, gifts: publicGifts }, { status: 200 });

  } catch (error) {
    // Handle server error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
