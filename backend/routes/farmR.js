import express from "express";

import {
    addFarm,
    getFarms,
    getFarmById,
    updateFarm,
    deleteFarm
} from "../controllers/farmcontrollers.js";

const router = express.Router();

router.post("/", addFarm);

router.get("/", getFarms);

router.get("/:id", getFarmById);

router.put("/:id", updateFarm);

router.delete("/:id", deleteFarm);

export default router;
