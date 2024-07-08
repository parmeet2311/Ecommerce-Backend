import express from "express";
import { createProduct } from "../controllers/vendorController";
import { verifyToken } from "../middleware/middleware";
import { submitVendorDocument, getVendorOrders, updateProductStatus, getAllItems, getParticularItem } from "../controllers/vendorController";
import { validateVendorSubmitDocument, validateCreateProduct } from "../middleware/vendorMiddleware";

const router = express.Router();

router.get("/protected-route", verifyToken, (req, res) => {
  // Access protected resource here
  return res
    .status(201)
    .json({ message: "Successfully accessed protect route." });
});

router.post(
  "/submit-document",
  validateVendorSubmitDocument,
  submitVendorDocument
);

router.post("/create-product",validateCreateProduct, createProduct);

router.get('/orders/:vendorId', getVendorOrders);

router.patch('/orders/:orderId/items/:itemId/status', updateProductStatus);

//get orders

router.get('/all-items', getAllItems);

//get particular orders

router.get('/:productId', getParticularItem);


export { router as vendorAction };
