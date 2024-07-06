import { Router } from "express";
import { TimeCalcul } from "../Controllers/TimesheetsController.js";

const router = Router();

router.put("/timeline/:customerId", TimeCalcul);

export default router;
