import express from 'express';
import {
  acceptClient,
  rejectClient,
  attendantMeetingOver,
  upcomingAppointments,
  getClientHistory,
} from '../Controllers/clientManagement.js';

const router = express.Router();


router.put('/accept/:employeeId', acceptClient);
router.put('/reject/:employeeId', rejectClient);
router.put('/meetingOver/:employeeId', attendantMeetingOver);
router.get('/upcoming/:employeeId', upcomingAppointments);
router.get('/history/:employeeId', getClientHistory);

export default router;
