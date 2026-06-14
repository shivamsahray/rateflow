// import express from "express";
// import { authMiddleware } from "../middleware/authMiddleware";
// import { getLastPrice, seedPriceHistory } from "../controllers/pricingController";

// const router = express.Router();

// router.get(
//   "/last-price",
//   authMiddleware,
//   getLastPrice
// );

// router.post(
//   "/seed",
//   authMiddleware,
//   seedPriceHistory
// );

// export default router;

import express from "express";
import { getLastPrice, seedPriceHistory } from "../controllers/pricingController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const auth = [authMiddleware, subscriptionMiddleware];

router.get("/last-price", ...auth, getLastPrice);
router.post("/seed",      ...auth, seedPriceHistory);

export default router;