import { Request, Response } from "express";
import { AdminProductModel } from "../models/admin/product/productAdminModel";
import { PaymentModel } from "../models/payment/payment";
import {
  FinancerOrderModel,
  IFinancerOrder,
} from "../models/Order/financeOrderModel";
import { Types } from "mongoose";
import { AdminFinancerOrderModel } from "../models/Order/adminFinancerOrder";

// Financer gets all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await AdminFinancerOrderModel.find().populate(
      "items.productId"
    );
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching financer orders:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Financer gets pending orders
export const getPendingOrders = async (req: Request, res: Response) => {
  try {
    const orders = await FinancerOrderModel.find({ status: "Pending" });
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Financer finalizes an order
export const finalizeOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { name, address, city, state, pincode, mob  } = req.body;

  try {
    const order = await FinancerOrderModel.findById(orderId);

    if (!name || !address || !city || !state || !pincode || !mob) {
      return res.status(404).json({ error: "Delivery address is incomplete!" });
    }
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Update the status of the order to "Finalized"
    order.status = "Order Placed";
    order.history.push({
      status: "Order finalized by financer",
      updatedAt: new Date(),
    });

    // Create a new order in AdminOrderModel
    const newAdminOrder = new AdminFinancerOrderModel({
      _id: order._id, // Ensuring the same ObjectId
      financerId: order.userId,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        status: "Pending",
        isPaid: item.isPaid,
        amountPaid: item.amountPaid,
      })),
      totalAmount: order.totalAmount,
      status: "Order Confirmed",
      history: [
        { status: "Order Confirmed", updatedAt: new Date() },
      ],
      deliveryAddress:{
        id: order.userId,
        name: name,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        mob: mob,
      },
    });

    await newAdminOrder.save();

    // Save the updated financer order
    await order.save();

    return res
      .status(200)
      .json({
        message: "Order placed successfully and sent to admin.",
        order: newAdminOrder,
      });
  } catch (error) {
    console.error("Error finalizing order:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Get all financer orders
export const getFinancerOrders = async (req: Request, res: Response) => {
  try {
    const orders = await FinancerOrderModel.find();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching financer orders:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Get a specific financer order
export const getFinancerOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await FinancerOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    return res.status(200).json({ order });
  } catch (error) {
    console.error(`Error fetching financer order with ID ${orderId}:`, error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Add item to financer order
export const addItemToOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const order = await FinancerOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    const product = await AdminProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const existingItemIndex = order.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (existingItemIndex !== -1) {
      // If the item already exists, update the quantity
      order.items[existingItemIndex].quantity += quantity;
    } else {
      // If the item does not exist, add it to the items array
      order.items.push({
        productId: new Types.ObjectId(productId),
        quantity: quantity,
        price: product.price,
        status: "Pending",
        isPaid: false,
        amountPaid: 0,
      });
    }

    // Update the total amount
    order.totalAmount += product.price * quantity;

    await order.save();

    return res.status(200).json({ message: "Item added successfully.", order });
  } catch (error) {
    console.error("Error adding item to order:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Update item quantity in financer order
export const updateItemQuantity = async (req: Request, res: Response) => {
  const { orderId, itemId } = req.params;
  const { quantity } = req.body;

  try {
    const order = await FinancerOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    await (order as IFinancerOrder).updateItemQuantity(itemId as any, quantity);

    return res
      .status(200)
      .json({ message: "Item quantity updated successfully.", order });
  } catch (error) {
    console.error(`Error updating item quantity in financer order:`, error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Delete item from financer order
export const deleteItemFromOrder = async (req: Request, res: Response) => {
  const { orderId, itemId } = req.params;

  try {
    const order = await FinancerOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    await (order as IFinancerOrder).deleteItem(itemId as any);

    return res
      .status(200)
      .json({ message: "Item deleted successfully.", order });
  } catch (error) {
    console.error(`Error deleting item from financer order:`, error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
