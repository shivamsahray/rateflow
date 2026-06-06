import express from "express";

import upload from "../middleware/uploadMiddleware";

import {
  uploadImage,
} from "../controllers/uploadController";

const router =
  express.Router();

router.post(
  "/",
  upload.single("image"),
  uploadImage
);

export default router;