import { Router } from "express";
import { parseCvController } from "../modules/cv/cv.controller";
import { parseProjectController } from "../modules/project/project.controller";
import uploadRoute from "./upload";

const router = Router();

router.post("/cv/parse", parseCvController);
router.post("/project/parse", parseProjectController);

router.use("/upload", uploadRoute);

export default router;
