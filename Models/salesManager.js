import mongoose from 'mongoose';

const SalesManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
});

const SalesManager = mongoose.model('SalesManager', SalesManagerSchema);

export default SalesManager;