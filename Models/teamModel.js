import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    salesExecutiveName: { type: String, required: true },
    salesExecutiveEmail: { type: String, required: true },
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    teamName: { type: String, required: true }
  }, { timestamps: true}, { _id : false });


const teamSchema = new mongoose.Schema({
    teamName: { type: String,required: true },
    projectName: {type: String,required: true }, 
    managerName: {type: String,required: true },
    managerEmail: {type: String, required: true},
    teamMemberNames: {
        type: [String],
        required: true
    },
    log: [logSchema]
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
