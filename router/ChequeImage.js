import express from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import { ChequeImage } from "../Controllers/chequeImage.js";
const router = express.Router();
router.post(
  "/save",
  upload.fields([
    {
      name: "chequeImage",
      maxCount: 1,
    },
  ]),
  ChequeImage
);

export default router;
