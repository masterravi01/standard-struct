import express from "express";
import userControllers from "../controllers/user.controllers.js";
const router = express.Router();
router.get("/users", userControllers.readUser);
export default router;
