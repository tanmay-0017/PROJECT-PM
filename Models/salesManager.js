import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


// const SalesManagerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String},
//   password: { type: String, required: true },
//   role: { type: String, default:"manager" }
// });

// const SalesManager = mongoose.model('SalesManager', SalesManagerSchema);

// export default SalesManager;

const SalesManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "manager" },
  resetOTP: {
    type: String,
  },
  resetOTPExpiry: {
    type: Date,

  }
});

SalesManagerSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const SalesManager = mongoose.model('SalesManager', SalesManagerSchema);

export default SalesManager;

