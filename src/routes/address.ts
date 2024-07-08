import express from "express";
import { validateDeliveryAddress } from "../middleware/addressMiddleware";
import {
  addDeliveryAddress,
  editDeliveryAddress,
  deleteDeliveryAddress,
  getAddressById
} from "../controllers/deliveryAddress";

const router = express.Router();

router.get("/getAddressById/:id", getAddressById);
router.post("/add", validateDeliveryAddress, addDeliveryAddress);
router.put("/:addressId/edit", validateDeliveryAddress, editDeliveryAddress);
router.delete("/:addressId/delete", deleteDeliveryAddress);

export { router as addressAction };
