import { Router } from "express";
import { parseCvController } from "../modules/cv/cv.controller";
import { parseProjectController } from "../modules/project/project.controller";
import uploadRoute from "./upload";
import evaluationRoutes from "./evaluator";

const router = Router();

router.post("/cv/parse", parseCvController);
router.post("/project/parse", parseProjectController);

router.use("/upload", uploadRoute);
router.use("/evaluate", evaluationRoutes);

export default router;
