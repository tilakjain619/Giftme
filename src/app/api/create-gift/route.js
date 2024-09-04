import Stripe from 'stripe';
import dbConnect from '@/utils/dbConnect'; // Assuming you have a MongoDB connection utility
import Supporter from '@/models/Supporter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();

  const { amount, userId, senderName, senderEmail, message, isPrivate } = await req.json();

  try {
    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe accepts amounts in cents
      currency: 'inr',
      payment_method_types: ['card'],
    });

    // Save initial supporter record with payment status as 'pending'
    const supporter = new Supporter({
      userId,
      amount,
      senderName,
      senderEmail,
      message,
      isPrivate,
      paymentStatus: 'pending',
      stripePaymentId: paymentIntent.id,
    });
    await supporter.save();

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
