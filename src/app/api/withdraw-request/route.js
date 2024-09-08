// app/api/withdraw-request/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import WithdrawRequest from '@/models/WithdrawRequest';
import User from '@/models/User'; // Import user model to check wallet balance

export async function POST(req) {
  try {
    const { email, requestAmount, paymentMethod, upiId, timestamp } = await req.json();

    // Connect to database
    await dbConnect();

    // Fetch the user from the database
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the requested amount matches the user's wallet balance
    if (requestAmount !== user.walletAmount) {
      return NextResponse.json({ error: 'Requested amount does not match wallet balance' }, { status: 400 });
    }

    // Save the withdrawal request to the database
    const newWithdrawRequest = new WithdrawRequest({
      email,
      requestAmount,
      paymentMethod,
      upiId,
      timestamp,
    });

    await newWithdrawRequest.save();

    // Update user's wallet balance to zero after successful request
    user.walletAmount = 0;
    await user.save();

    return NextResponse.json({ message: 'Withdrawal request saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving withdrawal request:', error);
    return NextResponse.json({ error: 'Failed to save withdrawal request' }, { status: 500 });
  }
}
