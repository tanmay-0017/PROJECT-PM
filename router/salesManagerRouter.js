import express from "express";
import {
  createSalesManager,
  getSalesManagers,
  getSalesManagerById,
  updateSalesManager,
  deleteSalesManager,
  findSalesManagerTeamData,
} from "../Controllers/salesManagerController.js";

const router = express.Router();

router.get("/fetch-all", getSalesManagers);
router.get("/fetch/:id", getSalesManagerById);
router.post("/save", createSalesManager);
router.put("/update/:id", updateSalesManager);
router.delete("/delete/:id", deleteSalesManager);
router.get("/findSalesManagerteamData/:managerEmail", findSalesManagerTeamData);

export default router;
