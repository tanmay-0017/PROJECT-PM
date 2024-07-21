import mongoose from "mongoose";

const createlog = new mongoose.Schema({
  ClientName: { type: String, required: true },
  ClientId: { type: String, required: true },
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
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const Attendant = mongoose.model("Attendant", attendantSchema);

export default Attendant;
