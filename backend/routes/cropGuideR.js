import express from "express";
import { getCropGuides, createCropGuide } from "../controllers/cropGuideController.js";

const router = express.Router();

router.get("/", getCropGuides);
router.post("/", createCropGuide);

export default router;
