import express from "express";
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  updateVendor,
} from "../controllers/vendorController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
const auth = [authMiddleware, subscriptionMiddleware];

router.get("/", ...auth, getVendors);
router.get("/:id", ...auth, getVendorById);
router.post("/", ...auth, createVendor);
router.put("/:id", ...auth, updateVendor);
router.delete("/:id", ...auth, deleteVendor);

export default router;
