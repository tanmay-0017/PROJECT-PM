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
    },
    team: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

const Attendant = mongoose.model('Attendant', attendantSchema);

export default Attendant;