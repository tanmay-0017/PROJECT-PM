import SalesManager from '../Models/salesManager.js';
import Team from '../Models/teamModel.js';
import Project from '../Models/projectModel.js';

export const createTeam = async (req, res) => {
  try {
    const { teamName, projectName, managerName, teamMemberName } = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { name : projectName },
      {
        $addToSet: {
          teams: teamName
        }
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const salesManager = await SalesManager.findOne({ name: managerName });

    if (!salesManager) {
      return res.status(404).json({ message: 'Sales Manager not found' });
    }

    const existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      // Add the new team member names to the existing team's teamMemberNames array
      existingTeam.teamMemberNames = Array.from(new Set([...existingTeam.teamMemberNames, ...teamMemberName]));
      await existingTeam.save();
      return res.status(200).json(existingTeam);
    }

    

    const team = await Team.create({
      teamName,
      projectName,
      managerName,
      managerEmail: salesManager.email,
      teamMemberNames: teamMemberName
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamsById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeams = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const team = await Team.findByIdAndUpdate(req.params.id, { name, email, phone }, { new: true });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeams = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json({ message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
