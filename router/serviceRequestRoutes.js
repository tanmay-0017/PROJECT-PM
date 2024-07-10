import express from 'express';
import {
    requestService,
    getrequestService
} from '../Controllers/serviceRequestController.js';
const router = express.Router();

router.route('/').post(requestService).get(getrequestService);

export default router;
