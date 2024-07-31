import { Router } from "express";
import { TimeCalcul } from "../Controllers/TimesheetsController.js";

const router = Router();

router.post("/timeline", TimeCalcul);

export default router;
