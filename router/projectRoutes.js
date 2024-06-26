import express from 'express';
import {
    getProjects,
    getProjectLocation,
    createProject,
    updateProject,
    deleteProject
} from '../Controllers/projectController.js';

const router = express.Router();

router.get('/projects', getProjects);
router.get('/projects/:name/location', getProjectLocation);
router.post('/projects', createProject);
router.put('/projects/:name', updateProject);
router.delete('/projects/:name', deleteProject);

export default router;
