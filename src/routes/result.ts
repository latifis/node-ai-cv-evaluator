import { Router } from "express";
import { getResultController } from "../modules/evaluation/evaluation.controller";

const router = Router();

router.get("/:id", getResultController);

export default router;