import mongoose from "mongoose";

const attendantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'assigned'],
        default: 'available'
    }
},
{
    timestamps: true
});

export const Attendant = mongoose.Schema('Attendant', attendantSchema);