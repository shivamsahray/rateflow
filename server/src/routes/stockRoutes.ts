// import express from "express";
// import { getStockList, updateStock } from "../controllers/stockController";
// import { authMiddleware } from "../middleware/authMiddleware";

// const router = express.Router();

// router.get("/", authMiddleware, getStockList);
// router.patch("/:id", authMiddleware, updateStock);

// export default router;

import express from "express";
import { getStockList, updateStock } from "../controllers/stockController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const auth = [authMiddleware, subscriptionMiddleware];

router.get("/",     ...auth, getStockList);
router.patch("/:id", ...auth, updateStock);

export default router;