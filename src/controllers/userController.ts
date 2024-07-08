import { Request, Response } from "express";
import { UserDocumentModel } from "../models/admin/documents/userDocument";
import { AdminProductModel } from "../models/admin/product/productAdminModel";
import { CartModel } from "../models/cart/Cart";
import { FinancerOrderModel } from "../models/Order/financeOrderModel";

export const submitUserDocument = async (req: any, res: any) => {
  const {
    userId,
    username,
    email,
    mobNum,
    dob,
    businessName,
    businessEmail,
    address,
    pincode,
    state,
  } = req.body;

  try {
    // Create a new product document using the ProductModel
    const newDocument = await UserDocumentModel.create({
      userId,
      isVerified: false,
      userDetails: {
        username,
        email,
        mobNum,
        dob,
      },
      businessDetails: {
        businessName,
        businessEmail,
        address,
        pincode,
        state,
      },
    });

    // Return success response with the newly created product
    return res.status(201).json({
      message: "Submitted document successfully.",
      product: newDocument,
    });
  } catch (error) {
    console.error("Error during product creation:", error);
    // Return error response if creation fails
    return res.status(500).json({ error: "Product creation failed." });
  }
};

export const addToUserCart = async (req: any, res: any) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await AdminProductModel.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(400).json({ error: "Product not available." });
    }

    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    const cartItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ message: "Product added to cart.", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getUserCart = async (req: any, res: any) => {
  const { userId } = req.params;

  try {
    const cart = await CartModel.findOne({ userId }).populate(
      "items.productId"
    );
    if (!cart) {
      return res.status(404).json({ error: "No items in cart." });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// User checkout to financer
export const checkoutToFinancer = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    // Fetch product details to get the prices
    const productIds = cart.items.map((item) => item.productId);
    const products = await AdminProductModel.find({ _id: { $in: productIds } });

    // Create a map of productId to price
    const productPriceMap: Record<string, number> = {};
    products.forEach((product) => {
      productPriceMap[product._id.toString()] = product.price;
    });

    // Calculate the total amount and update cart items with price and total cost validation
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      const price = productPriceMap[item.productId.toString()];
      if (!price) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      totalAmount += item.quantity * price;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        status: "Pending",
        isPaid: false,
        amountPaid: 0,
      };
    });

    // Create a new financer order
    const newFinancerOrder = new FinancerOrderModel({
      userId,
      items: orderItems,
      totalAmount,
      status: "Pending",
      history: [{ status: "Order placed", updatedAt: new Date() }],
    });

    await newFinancerOrder.save();

    // Clear the cart after checkout
    await CartModel.updateOne({ userId }, { $set: { items: [] } });

    return res
      .status(201)
      .json({ message: "Order sent to finance.", order: newFinancerOrder });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
