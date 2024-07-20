import express from 'express';
import {
    getProjects,
    getProjectLocation,
    createProject,
    updateProject,
    deleteProject
} from '../Controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/location/:name', getProjectLocation);

router.post('/', upload.fields([
    {
        name: "projectImage",
        maxCount: 1
    }
]), createProject);

router.put('/update/:name', updateProject);
router.delete('/delete/:name', deleteProject);

export default router;
