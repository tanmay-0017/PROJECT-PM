import express from 'express';
import { 
  getInfo,
  updateAttendant, 
  deleteAttendant 
} from '../Controllers/settingsControllerExecutive.js';

const router = express.Router();


router.get('/:employeeId', getInfo);


router.put('/:employeeId', updateAttendant);


router.delete('/:employeeId', deleteAttendant);

export default router;
