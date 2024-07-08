import { ProductModel } from "../models/vendor/productModel";
import { VendorDocumentModel } from "../models/admin/documents/vendorDocument";
import { Request, Response, NextFunction } from "express";
import { OrderModel } from "../models/Order/vendorOrder";

export const submitVendorDocument = async (req: any, res: any) => {
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
    panNumber,
    aadharNum,
    gstNum,
    aadharFrontImgUrl,
    aadharBackImgUrl,
    panImgUrl,
    gstImgUrl,
  } = req.body;

  try {
    // Create a new product document using the ProductModel
    const newDocument = await VendorDocumentModel.create({
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
      documentDetails: {
        panNumber,
        aadharNum,
        gstNum,
        aadharFrontImgUrl,
        aadharBackImgUrl,
        panImgUrl,
        gstImgUrl,
      },
    });

    // Return success response with the newly created product
    return res.status(201).json({
      message: "Submitted document successfully.",
      product: newDocument,
    });
  } catch (error) {
    console.error("Failed to submit document", error);
    // Return error response if creation fails
    return res.status(500).json({ error: "Failed to submit document" });
  }
};

export const createProduct = async (req: any, res: any) => {
  const {
    vendorId,
    title,
    description,
    shortDescription,
    quantity,
    price,
    image,
    isAvailable,
    otherDetails,
  } = req.body;

  try {
    // Create a new product document using the ProductModel
    const newProduct = await ProductModel.create({
      vendorId,
      title,
      description,
      shortDescription,
      quantity,
      price,
      image,
      isAvailable,
      otherDetails,
    });

    // Return success response with the newly created product
    return res.status(201).json({
      message: "Created product successful.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error during product creation:", error);
    // Return error response if creation fails
    return res.status(500).json({ error: "Product creation failed." });
  }
};

export const getVendorOrders = async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  try {
    const orders = await OrderModel.find({ "items.vendorId": vendorId });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this vendor." });
    }

    const vendorOrders = orders.map((order) => {
      const vendorItems = order.items.filter(
        (item) => item.vendorId === parseInt(vendorId)
      );
      const formattedItems = vendorItems.map((item) => ({
        productId: item.productId,
        vendorId: item.vendorId,
        quantity: item.quantity,
        price: item.price,
        status: item.status,
        isPaid: item.isPaid,
        history: item.history,
      }));
      return {
        _id: order._id,
        userId: order.userId,
        items: formattedItems,
      };
    });

    return res.status(200).json({ orders: vendorOrders });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();

    if (!products.length) {
      return res.status(200).json({ products: [] });
    } else {
      return res.status(200).json({ products: products });
    }
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getParticularItem = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(400).json({ error: "Product is unavailable!" });
    } else {
      return res.status(200).json({ product });
    }
  } catch (error) {
    console.error("Error fetching vendor product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateProductStatus = async (req: Request, res: Response) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  try {
    // Fetch the order
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Find the specific order item
    const orderItem = order.items.find(
      (item) => item.productId.toString() === itemId
    );
    if (!orderItem) {
      return res.status(404).json({ error: "Order item not found." });
    }

    // Update the status of the order item
    orderItem.status = status;

    // Update the order history
    orderItem.history.push({
      status: `Status updated to ${status}`,
      updatedAt: new Date(),
    });

    await order.save();

    // Return success response
    return res
      .status(200)
      .json({ message: "Order item status updated successfully." });
  } catch (error) {
    console.error("Failed to update order item status:", error);
    return res
      .status(500)
      .json({ error: "Failed to update order item status." });
  }
};
