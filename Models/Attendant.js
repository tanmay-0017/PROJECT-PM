import mongoose from "mongoose";

const createlog = new mongoose.Schema({
  ClientName: { type: String },
  ClientId: { type: String },
});

const attendantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "assigned"],
      default: "available",
    },
    team: {
      type: String,
    },
    employeeId: {
      type: String,
      required: true,
    },
    emailID: {
      type: String,
      required: true,
    },
    ClientName: [createlog],
    project: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Attendant = mongoose.model("Attendant", attendantSchema);

export default Attendant;
