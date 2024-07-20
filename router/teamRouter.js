import express from 'express';
import {
  createTeam,
  getAllTeams,
  getTeamsById,
  updateTeams,
  deleteTeams
} from '../Controllers/teamController.js';

const router = express.Router();


router.post('/save', createTeam);
router.get('/fetch-all', getAllTeams);
router.get('/:id', getTeamsById);
router.put('/:id', updateTeams);
router.delete('/:id', deleteTeams);

export default router;