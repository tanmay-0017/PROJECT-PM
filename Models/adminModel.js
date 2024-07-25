import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetOTP: {
        type: String,
    },
    resetOTPExpiry: {
        type: Date,

    }
});

export const Admin = mongoose.model('Admin', adminSchema);
