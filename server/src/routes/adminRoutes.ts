import express from "express";
import {
  adminLogin,
  getAllTenants,
  activateTenant,
  deactivateTenant,
  updateTenant,
} from "../controllers/adminController";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.post("/login",                        adminLogin);
router.get("/tenants",                       adminMiddleware, getAllTenants);
router.post("/tenants/:id/activate",         adminMiddleware, activateTenant);
router.post("/tenants/:id/deactivate",       adminMiddleware, deactivateTenant);
router.patch("/tenants/:id",                 adminMiddleware, updateTenant);  // ✅ NEW

export default router;