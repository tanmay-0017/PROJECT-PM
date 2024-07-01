import Project from '../Models/projectModel.js';

// Get all projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single project by name
export const getProjectLocation = async (req, res) => {
    try {
        const project = await Project.findOne({ name: req.params.name });
        if (project) {
            res.status(200).json({ location: project.location, teams: project.teams });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new project
export const createProject = async (req, res) => {
    const { name, location, teams } = req.body;

    const newProject = new Project({
        name,
        location,
        teams
    });

    try {
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing project
export const updateProject = async (req, res) => {
    const { name } = req.params;
    const { location, teams } = req.body;

    try {
        const updatedProject = await Project.findOneAndUpdate(
            { name },
            { location, teams },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a project
export const deleteProject = async (req, res) => {
    const { name } = req.params;

    try {
        const deletedProject = await Project.findOneAndDelete({ name });

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
