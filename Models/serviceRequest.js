import mongoose from 'mongoose';

const serviceRequestSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    typeOfService: {
        type: String,
        required: true,
    },
    projectName: {
        type: String,
        required: true,
    },
    servicePerson: {
        type: String,
        required: true,
    },
    servicePersonName: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
