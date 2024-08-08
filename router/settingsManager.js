import express from 'express';
import { 
  getSalesManagerInfo,
  updateSalesManager, 
  deleteSalesManager 
} from '../Controllers/settingsControllerManager.js';

const router = express.Router();


router.get('/:employeeId', getSalesManagerInfo);

router.put('/:employeeId', updateSalesManager);

router.delete('/:employeeId', deleteSalesManager);

export default router;
