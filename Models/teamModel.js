import mongoose from "mongoose";
/*
const teamsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true },
  teamName: { type: String },
  emailID: { type: String, required: true },
  projectName: { type: String, required: true },
  managerName: { type: String },
  ClientName: { type: String },
});
/*
const logSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    salesExecutiveName: { type: String, required: true },
    salesExecutiveEmail: { type: String, required: true },
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    teamName: { type: String, required: true },
  },
  { timestamps: true },
  { _id: false }
);
// Create a new project
const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  projectName: { type: String, required: true },
  managerName: { type: String, required: true },
  managerEmail: { type: String, required: true },
  teamMemberNames: [teamsSchema],

  //log: [logSchema],
});

const Team = mongoose.model("Team", teamSchema);

export default Team;
*/

const teamsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true },
  teamName: { type: String },
  emailID: { type: String, required: true },
  projectName: { type: String, required: true },
  managerName: { type: String },
  ClientName: { type: [String], default: [] }, // Update here
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  projectName: { type: String, required: true },
  managerName: { type: String, required: true },
  managerEmail: { type: String, required: true },
  teamMemberNames: [teamsSchema],
});

const Team = mongoose.model("Team", teamSchema);

export default Team;
