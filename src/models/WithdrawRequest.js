import mongoose from 'mongoose';

const WithdrawRequestSchema = new mongoose.Schema({
    email: { type: String, required: true },
    requestAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    upiId: { type: String },
    status: {type: String, default: "pending"},
    timestamp: { type: Date, required: true },
});

export default mongoose.models.WithdrawRequest || mongoose.model('WithdrawRequest', WithdrawRequestSchema);
