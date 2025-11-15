import { Router } from "express";
import { parseCvController } from "../modules/cv/cv.controller";

const router = Router();

router.post("/cv/parse", parseCvController);

export default router;
