import express from "express";

import {
    cropRecommendation,
    fertilizerRecommendation,
    getHistory,
    getDashboard
} from "../controllers/recomController.js";

const router = express.Router();

router.post("/crop", cropRecommendation);

router.post("/fertilizer", fertilizerRecommendation);

router.get("/history", getHistory);

router.get("/dashboard", getDashboard);

export default router;
