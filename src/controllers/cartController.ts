import { Request, Response } from "express";
import { ProductModel } from "../models/vendor/productModel";
import { CartModel } from "../models/cart/Cart";

export const addToCart = async (req: any, res: any) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await ProductModel.findById(productId);
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

export const getCart = async (req: any, res: any) => {
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

// Update item quantity in cart
export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in cart." });
    }

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({ message: "Item quantity updated successfully.", cart });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Delete item from cart
export const deleteCartItem = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;

  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart." });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return res.status(200).json({ message: "Item deleted from cart successfully.", cart });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
