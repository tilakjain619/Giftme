import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
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
    upiId: String,
}, {
    timestamps: true
})

export default mongoose.models.User || mongoose.model('User', UserSchema);