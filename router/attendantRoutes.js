import express from 'express';
import {
    createAttendant,
    deleteAttendant,
    getAttendantById,
    getAttendants,
    updateAttendant,
    makeAttendantAvailable
    
} from '../Controllers/attendantController.js';

const router = express.Router();

router.post('/save', createAttendant);
router.get('/fetch-all', getAttendants);
router.get('/fetch/:id', getAttendantById);
router.put('/update/:id', updateAttendant);
router.put('/attendantAvailable/:id', makeAttendantAvailable);
router.delete('/delete/:id', deleteAttendant);

export default router;