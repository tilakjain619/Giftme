import Stripe from 'stripe';
import dbConnect from '@/utils/dbConnect'; // Assuming you have a MongoDB connection utility
import Supporter from '@/models/Supporter';
import { NextResponse } from 'next/server';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();

  const { amount, userId, senderName, senderEmail, message, isPrivate } = await req.json();

  try {
    // Validate that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe accepts amounts in cents
      currency: 'inr',
      payment_method_types: ['card'],
    });

    // Correctly returning the response
    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
  } catch (error) {
    // Correctly returning the error response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
