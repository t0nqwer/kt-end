import express from "express";
import { LogInUser, createEmployee } from "../controller/user.js";
const router = express.Router();
router.post("/create", createEmployee);
router.post("/login", LogInUser);
export default router;
