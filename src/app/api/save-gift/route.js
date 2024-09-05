import dbConnect from '@/utils/dbConnect';
import Supporter from '@/models/Supporter';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnect();

    try {
        const { amount, userId, senderName, senderEmail, message, isPrivate, paymentStatus, stripePaymentId } = await req.json();

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

        return NextResponse.json({ message: 'Supporter record saved successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
