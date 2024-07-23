import express from "express";
import {
  createTeam,
  getAllTeams,
  getTeamsById,
  updateTeams,
  deleteTeams,
  addonemember,
} from "../Controllers/teamController.js";

const router = express.Router();

router.post("/save", createTeam);
router.post("/addOne", addonemember);
router.get("/fetch-all", getAllTeams);
router.get("/:id", getTeamsById);
router.put("/:id", updateTeams);
router.delete("/:id", deleteTeams);

export default router;
