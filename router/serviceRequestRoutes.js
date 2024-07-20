import express from 'express';
import {
    requestService,
    getrequestService,
    getAllRequestService
} from '../Controllers/serviceRequestController.js';
const router = express.Router();

router.route('/').post(requestService).put(getrequestService).get(getAllRequestService);

export default router;
