import express from "express";
import { verifyToken } from "../middleware/middleware";
import {
  getAllOrders,
  getPendingOrders,
  finalizeOrder,
  getFinancerOrders,
  getFinancerOrderById,
  updateItemQuantity,
  deleteItemFromOrder,
  addItemToOrder,
} from "../controllers/financerController";

const router = express.Router();

router.get("/protected-route", verifyToken, (req, res) => {
  // Access protected resource here
  return res
    .status(201)
    .json({ message: "Successfully accessed protect route." });
});

router.get("/orders/pending", verifyToken, getPendingOrders);
router.get("/orders/all", getAllOrders);
router.post("/orders/:orderId/finalize", verifyToken, finalizeOrder);

router.get("/orders", verifyToken, getFinancerOrders);
router.get("/orders/:orderId", verifyToken, getFinancerOrderById);
router.post("/orders/:orderId/items", verifyToken, addItemToOrder); // New endpoint to add items to the order
router.put("/orders/:orderId/items/:itemId", verifyToken, updateItemQuantity);
router.delete(
  "/orders/:orderId/items/:itemId",
  verifyToken,
  deleteItemFromOrder
);

export { router as financerAction };
