import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    bio:{
        type: String
    },
    socialLinks: [{
        platform: String,
        url: String
    }],
    theme: String,
    username:{
        type: String,
        required: true,
        unique: true
    },
    upiId: {
        type: String,
        match: [/^[\w.-]+@[\w.-]+$/, 'Please enter a valid UPI ID']
    },
    walletAmount:{
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

export default mongoose.models.User || mongoose.model('User', UserSchema);