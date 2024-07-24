import mongoose from "mongoose";

const teamsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true },
  teamName: { type: String },
  emailID: { type: String, required: true },
  projectName: { type: String, required: true },
  managerName: { type: String },
  ClientName: { type: Array },
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
