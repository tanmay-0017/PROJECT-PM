import mongoose from 'mongoose';

const SalesManagerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  employeeId: {
    type: String 
  },
  location:{
    type: String,
  },
  country: {
    type: String,
    default: "INDIA"
  },
  postalCode: {
    type: String,
  },
  aadharCard : {
    type: String,
  }
});

const SalesManager = mongoose.model('SalesManager', SalesManagerSchema);

export default SalesManager;