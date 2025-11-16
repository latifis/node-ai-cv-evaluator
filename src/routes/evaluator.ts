import { Router } from "express";
import { enqueueController, getResultController } from "../modules/evaluation/evaluation.controller";

const router = Router();

router.post("/", enqueueController);
router.get("/:id", getResultController);

export default router;