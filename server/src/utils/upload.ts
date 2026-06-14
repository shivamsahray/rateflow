
import multer from "multer";
import path from "path";
import crypto from "crypto";

// Configure disk storage for payment proofs
const paymentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../uploads/payments"));
  },
  filename: (_req, file, cb) => {
    // unique filename: timestamp-random.ext
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, filename);
  }
});
export const paymentUpload = multer({
  storage: paymentStorage,
  fileFilter: (_req, file, cb) => {
    // accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // e.g. 5 MB limit
});
