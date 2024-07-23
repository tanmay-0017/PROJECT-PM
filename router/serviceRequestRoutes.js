import express from "express";
import {
  requestService,
  getrequestService,
  getAllRequestService,
  statusFeedbackAndStar,
} from "../Controllers/serviceRequestController.js";
const router = express.Router();

router
  .route("/")
  .post(requestService)
  .put(getrequestService)
  .get(getAllRequestService);
router.route("/feedback/:id").put(statusFeedbackAndStar);
export default router;
