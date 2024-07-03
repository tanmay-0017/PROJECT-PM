import express from 'express';
import {
    requestService
} from '../Controllers/serviceRequestController.js';
const router = express.Router();

router.route('/').get(requestService);

export default router;
