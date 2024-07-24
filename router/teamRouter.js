import express from "express";
import {
  createTeam,
  getAllTeams,
  getTeamsById,
  updateTeams,
  deleteTeams,
  addonemember,
  teamfliter,
} from "../Controllers/teamController.js";

const router = express.Router();

router.post("/save", createTeam);
router.post("/addOne", addonemember);
router.post("/teamfliter", teamfliter);
router.get("/fetch-all", getAllTeams);
router.get("/:id", getTeamsById);
router.put("/:id", updateTeams);
router.delete("/:id", deleteTeams);

export default router;
