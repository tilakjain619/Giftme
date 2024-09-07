import mongoose from 'mongoose';

const SupporterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  senderName: {
    type: String
  },
  senderEmail: {
    type: String
  },
  paymentStatus: {
    type: String,
    required: true, // Stripe payment status (e.g., succeeded, pending, etc.)
  },
  stripePaymentId:{
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Supporter || mongoose.model('Supporter', SupporterSchema);
