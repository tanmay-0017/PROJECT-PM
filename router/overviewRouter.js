import express from "express";
import {
  getNumberOfDirectVisitors,
  getNumberOfChannelVisitors,
  getTotalMeetings,
  DealsClosed,
  onlineEmployStatus,
  Top_Executive,
  Bar,
  getNotes,
} from "../Controllers/overviewController.js";

const router = express.Router();

router.get("/direct-visitors", getNumberOfDirectVisitors);
router.get("/channel-visitors", getNumberOfChannelVisitors);
router.get("/total-meetings", getTotalMeetings);
router.get("/total-DealsClosed", DealsClosed);
router.get("/total-status", onlineEmployStatus);
router.get("/Top_Executive", Top_Executive);
router.get("/Bar", Bar);
router.get("/Note", getNotes);

export default router;
