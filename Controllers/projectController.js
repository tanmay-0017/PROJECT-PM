import Project from "../Models/projectModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
      res
        .status(200)
        .json({ location: project.location, teams: project.teams });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new project
// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, location, teams, address, description } = req.body;

    // Check if projectImage file is present
    if (!req.files || !req.files.projectImage || !req.files.projectImage[0]) {
      return res
        .status(400)
        .json({ message: "Project Image file is required" });
    }

    const projectImageLocalPath = req.files.projectImage[0].path;

    // Upload the image to Cloudinary
    const projectImage = await uploadOnCloudinary(projectImageLocalPath);
    if (!projectImage) {
      return res
        .status(500)
        .json({ message: "Failed to upload project image to Cloudinary" });
    }

    // Create a new project
    const newProject = new Project({
      name,
      location,
      teams,
      address,
      description,
      projectImage: projectImage.url,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error.message);
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Project not found" });
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
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ProjectFilter = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(404).json({ message: "Project not found" });
    }
    const project = await Project.findOne({ name: name });

    return res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
