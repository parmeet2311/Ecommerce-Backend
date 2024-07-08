import express from "express";
import {
  getCart,
  addToCart,
  approveDocument,
  createAdminProduct,
  getVendorDocument,
  getUserDocument,
  getOrderDetail,
  updateProductStatus,
  getAllItems,
  getParticularItem,
  updatePaymentStatus,
  reports,
  profileDetails
} from "../controllers/adminController";
import { placeOrder } from "../controllers/orderController";
import {
  updateCartItemQuantity,
  deleteCartItem,
} from "../controllers/cartController";
import {
  checkProductQuantity,
  validateCreateAdminProduct,
  validateObjectId
} from "../middleware/adminMiddleware";
import { sendPayment } from "../controllers/common";

const router = express.Router();


router.post("/profile", profileDetails);

//documents

router.post("/approve-document/:documentId", approveDocument);

router.get("/vendor/get-documents", getVendorDocument);

router.get("/user/get-documents", getUserDocument);

//cart operation

router.get("/cart/:userId", getCart);

router.put("/cart/:userId/items/:productId", updateCartItemQuantity);

router.delete("/cart/:userId/items/:productId", deleteCartItem);

router.post("/addToCart", checkProductQuantity, addToCart);

router.post("/order", placeOrder);

router.post("/send-payment", sendPayment);

router.post("/create-product", validateCreateAdminProduct, createAdminProduct);

//update Product status

router.patch('/orders/:orderId/status', updateProductStatus);

router.patch('/orders/:orderId/payment', updatePaymentStatus);

//order details

router.get("/order/:orderId", getOrderDetail);

router.get("/reports", reports)



//get orders

router.get('/all-items', getAllItems);

router.get("/:productId",validateObjectId, getParticularItem);

export { router as adminAction };
