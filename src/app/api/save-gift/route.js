// pages/api/save-supporter.js

import dbConnect from '@/utils/dbConnect';
import Supporter from '@/models/Supporter';

export default async function POST(req, res) {
    await dbConnect();

    const { amount, userId, senderName, senderEmail, message, isPrivate, paymentStatus, stripePaymentId } = req.body;

    try {
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

      res.status(200).json({ message: 'Supporter record saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}
