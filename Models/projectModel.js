import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    teams: [{
        type: String, // Array of team names
        default : []
    }],
    address: {
        type: String,
        required: true
    },
    projectImage: {
        type: String, // cloudinary url
        required: true
    }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
