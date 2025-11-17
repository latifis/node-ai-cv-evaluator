import { Router } from "express";
import { enqueueController } from "../modules/evaluation/evaluation.controller";

const router = Router();

router.post("/", enqueueController);

export default router;