import express from 'express';
import {
  getNumberOfDirectVisitors,
  getNumberOfChannelVisitors,
  getTotalMeetings,
} from '../Controllers/overviewController.js';

const router = express.Router();

router.get('/direct-visitors', getNumberOfDirectVisitors);
router.get('/channel-visitors', getNumberOfChannelVisitors);
router.get('/total-meetings', getTotalMeetings);

export default router;
