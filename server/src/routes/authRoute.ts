import express from 'express';

import { register, login, getMe, verifyEmail, resendVerification, forgotPassword, verifyResetOTP, resetPassword, changePassword } from "../controllers/authController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);

router.get(
    "/me",
    authMiddleware,
    getMe
);

export default router;