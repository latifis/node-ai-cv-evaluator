import { Router } from "express";
import { uploadController } from "../modules/file/file.controller";
import { uploadMiddleware } from "../lib/multer";

const router = Router();

router.post(
  "/",
  uploadMiddleware.fields([
    { name: "cv", maxCount: 1 },
    { name: "report", maxCount: 1 }
  ]),
  uploadController
);

export default router;
