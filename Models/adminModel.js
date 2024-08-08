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
    role: {
        type: String,
        // enum: ['super admin', 'sales executive', 'manager'],
        role: { type: String, default: "super admin" }
    },

    resetOTP: { 
        type: String,
    },
    resetOTPExpiry: {
        type: Date,

    }
});

export const Admin = mongoose.model('Admin', adminSchema);
