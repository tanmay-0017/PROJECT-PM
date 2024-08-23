import express from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import {
  getProjects,
  getProjectLocation,
  createProject,
  updateProject,
  deleteProject,
  ProjectFilter,
} from "../Controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/location/:name", getProjectLocation);

router.post(
  "/",
  upload.fields([
    {
      name: "projectImage",
      maxCount: 1,
    },
  ]),
  createProject
);

router.put("/update/:name", updateProject);
router.delete("/delete/:id", deleteProject);
router.post("/ProjectFilter", ProjectFilter);

export default router;
