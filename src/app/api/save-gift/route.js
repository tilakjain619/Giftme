import dbConnect from '@/utils/dbConnect';
import Supporter from '@/models/Supporter';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();

  try {
    const { 
      amount, 
      userId, 
      senderName, 
      senderEmail, 
      message, 
      isPrivate, 
      paymentStatus, 
      stripePaymentId 
    } = await req.json();

    // Validate input data
    if (!amount || !userId || !paymentStatus || !stripePaymentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new supporter record
    const supporter = new Supporter({
      userId,
      amount,
      senderName,
      senderEmail,
      message,
      isPrivate,
      paymentStatus,
      stripePaymentId,
    });

    await supporter.save();

    // Update user's walletAmount
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize walletAmount if it does not exist
    if (user.walletAmount === undefined) {
      user.walletAmount = 0;
    }

    user.walletAmount += Number(amount); // Increment the user's walletAmount by the gifted amount
    try {
        await user.save();
      } catch (error) {
        console.error('Error saving user:', error);
        return NextResponse.json({ error: 'Error saving user' }, { status: 500 });
      }

    return NextResponse.json({ message: 'Supporter record saved and wallet updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing payment and updating wallet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
