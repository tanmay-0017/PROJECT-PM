import express from 'express';
import {
    requestService
} from '../Controllers/serviceRequestController.js';
const router = express.Router();

router.route('/').post(requestService);

export default router;
