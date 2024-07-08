import express from "express";
import { verifyToken } from "../middleware/middleware";
import {
  submitUserDocument,
  addToUserCart,
  getUserCart,
  checkoutToFinancer,
} from "../controllers/userController";
import {
  validateUserSubmitDocument,
  checkAdminProductQuantity,
} from "../middleware/userMiddleware";

const router = express.Router();

router.get("/protected-route", verifyToken, (req, res) => {
  // Access protected resource here
  return res
    .status(201)
    .json({ message: "Successfully accessed protect route." });
});

router.post(
  "/submit-document",
  verifyToken,
  validateUserSubmitDocument,
  submitUserDocument
);

//add to cart
router.post(
  "/add-to-cart",
  verifyToken,
  checkAdminProductQuantity,
  addToUserCart
);

//get product from cart
router.get("/cart/:userId", verifyToken, getUserCart);

//checkout product to finance
router.post("/cart/checkout", verifyToken, checkoutToFinancer);

export { router as userAction };
