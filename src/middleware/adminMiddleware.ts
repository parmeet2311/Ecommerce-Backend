import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../models/vendor/productModel";
import { CartModel } from "../models/cart/Cart";
import { UserModel } from "../models/user/user";
import { AdminProductModel } from "../models/admin/product/productAdminModel";
import mongoose from 'mongoose';

export const checkProductQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Fetch the product from the database
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Fetch the user's cart
    const cart = await CartModel.findOne({ userId });

    // Calculate the total quantity in the cart for the given product
    let totalQuantityInCart = 0;
    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existingItem) {
        totalQuantityInCart = existingItem.quantity;
      }
    }

    // Check if the total quantity (existing + new) exceeds the available quantity
    if (totalQuantityInCart + quantity > product.quantity) {
      return res.status(400).json({ error: "Insufficient product quantity." });
    }

    // Product quantity is sufficient, proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error("Error checking product quantity:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const validateCreateAdminProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    adminId,
    title,
    description,
    shortDescription,
    quantity,
    price,
    image,
    isAvailable,
    otherDetails,
  } = req.body;

  // Check if user exists
  const existingUser = await UserModel.findOne({ userId: adminId });
  if (!existingUser) {
    return res.status(400).json({ error: "You are not registered!" });
  }
  if (existingUser.role != "admin") {
    return res.status(400).json({ error: "You are not admin!" });
  }
  // Check if a product with the same title already exists for the user
  const lowercaseTitle = title.toLowerCase();
  const existingProduct = await AdminProductModel.findOne({
    title: lowercaseTitle,
  });
  if (existingProduct) {
    return res
      .status(400)
      .json({ error: "Product with this title already exists." });
  }

  // Check if all fields are entered
  const requiredFields = [
    "adminId",
    "title",
    "description",
    "shortDescription",
    "quantity",
    "units",
    "price",
    "image",
    "isAvailable",
    "otherDetails",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  try {
    next();
  } catch (error) {
    console.error("Error checking document existence:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  next();
};