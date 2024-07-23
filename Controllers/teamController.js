import SalesManager from "../Models/salesManager.js";
import Team from "../Models/teamModel.js";
import Project from "../Models/projectModel.js";
import Attendant from "../Models/Attendant.js";
/*
export const createTeam = async (req, res) => {
  try {
    const { teamName, projectName, managerName, teamMemberName } = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName },
      {
        $addToSet: {
          teams: teamName,
        },
      },
      { new: true }
    );

    const Attendants = await Promise.all(
      teamMemberName.map((memberName) => {
        return Attendant.findOneAndUpdate(
          { name: memberName },
          {
            $set: {
              project: projectName,
              team: teamName,
              managerName,
            },
          }
        );
      })
    );

    if (!Attendants) {
      console.error(
        "No attendants found for provided member names:",
        teamMemberName
      );
      return res.status(404).json({ message: "Attendant not found" });
    }

    console.log("Attendants updated:", Attendants);

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const salesManager = await SalesManager.findOne({ name: managerName });

    if (!salesManager) {
      return res.status(404).json({ message: "Sales Manager not found" });
    }

    const existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      // Add the new team member names to the existing team's teamMemberNames array
      existingTeam.teamMemberNames = Array.from(
        new Set([...existingTeam.teamMemberNames, ...teamMemberName])
      );
      await existingTeam.save();
      return res.status(200).json(existingTeam);
    }

    const team = await Team.create({
      teamName,
      projectName,
      managerName,
      managerEmail: salesManager.email,
      teamMemberNames: teamMemberName,
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

export const createTeam = async (req, res) => {
  try {
    const { teamName, projectName, managerName, teamMemberName } = req.body;

    // Validate input data
    if (
      !teamName ||
      !projectName ||
      !managerName ||
      !Array.isArray(teamMemberName)
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Update project with new team name
    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName },
      { $addToSet: { teams: teamName } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update attendants with project and team information
    const attendants = await Promise.all(
      teamMemberName.map((memberName) =>
        Attendant.findOneAndUpdate(
          { name: memberName },
          {
            $set: {
              project: projectName,
              team: teamName,
              managerName,
            },
          },
          { new: true }
        )
      )
    );

    // Check if any attendants were not found
    if (attendants.includes(null)) {
      return res
        .status(404)
        .json({ message: "One or more attendants not found" });
    }

    console.log("Attendants updated:", attendants);

    // Find sales manager
    const salesManager = await SalesManager.findOne({ name: managerName });

    if (!salesManager) {
      return res.status(404).json({ message: "Sales Manager not found" });
    }

    // Check if the team already exists
    let existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      // Add new team members to the existing team
      existingTeam.teamMemberNames = Array.from(
        new Set([...existingTeam.teamMemberNames, ...teamMemberName])
      );
      await existingTeam.save();
      return res.status(200).json(existingTeam);
    }

    // Create a new team
    const team = await Team.create({
      teamName,
      projectName,
      managerName,
      managerEmail: salesManager.email,
      teamMemberNames: teamMemberName,
    });

    res.status(201).json(team);
  } catch (error) {
    console.error(error);
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
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeams = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    );
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeams = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
