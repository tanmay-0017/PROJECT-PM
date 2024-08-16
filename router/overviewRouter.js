import express from "express";
import {
  getNumberOfDirectVisitors,
  getNumberOfChannelVisitors,
  getTotalMeetings,
  DealsClosed,
  onlineEmployStatus,
} from "../Controllers/overviewController.js";

const router = express.Router();

router.get("/direct-visitors", getNumberOfDirectVisitors);
router.get("/channel-visitors", getNumberOfChannelVisitors);
router.get("/total-meetings", getTotalMeetings);
router.get("/total-DealsClosed", DealsClosed);
router.get("/total-status", onlineEmployStatus);

export default router;
