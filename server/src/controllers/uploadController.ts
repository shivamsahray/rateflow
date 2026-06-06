import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";

export const uploadImage = async (
  req: Request,
  res: Response
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result =
      await cloudinary.uploader.upload(
        file.path,
        {
          folder: "rateflow",
        }
      );

    res.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};