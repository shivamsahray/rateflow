// import express from "express";

// import {
//   createProduct,
//   getProducts,
//   updateProduct,
//   deleteProduct,
// } from "../controllers/productController";

// import { authMiddleware } from "../middleware/authMiddleware";

// const router = express.Router();

// router.post(
//   "/",
//   authMiddleware,
//   createProduct
// );

// router.get(
//   "/",
//   authMiddleware,
//   getProducts
// );

// router.put(
//   "/:id",
//   authMiddleware,
//   updateProduct
// );

// router.delete(
//   "/:id",
//   authMiddleware,
//   deleteProduct
// );

// export default router;

import express from "express";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/productController";
import { authMiddleware, subscriptionMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const auth = [authMiddleware, subscriptionMiddleware];

router.post("/",    ...auth, createProduct);
router.get("/",     ...auth, getProducts);
router.put("/:id",  ...auth, updateProduct);
router.delete("/:id", ...auth, deleteProduct);

export default router;