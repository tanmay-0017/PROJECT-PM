import express from "express";
import { createAdmin, deleteAdmin, deleteAllAdmins, forgotPassword, loginAdmin, updateAdmin } from "../Controllers/adminController.js";


const router = express.Router();

router.post("/save", createAdmin);
router.post("/login", loginAdmin);
router.post("/forget-pass", forgotPassword);
router.put('/update/:id', updateAdmin);
router.delete('/delete/:id', deleteAdmin);
router.delete('/delete-all', deleteAllAdmins);




export default router;
