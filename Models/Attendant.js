import mongoose from "mongoose";

const createlog = new mongoose.Schema(
  {
    ClientName: { type: String },
    ClientId: { type: String },
    ClientEmail: { type: String },
    ClientMobile: { type: String },
    ClientProject: { type: String },
    completed: {
      type: String,
      enum: ["completed", "notCompleted", "progress"],
      default: "progress",
    },
    accepted: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
    timeDuration: {
      type: String,
      default: "00:00",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

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
    managerName: {
      type: String,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Attendant = mongoose.model("Attendant", attendantSchema);

export default Attendant;
