import { UserDocumentModel } from "../models/admin/documents/userDocument";
import { VendorDocumentModel } from "../models/admin/documents/vendorDocument";
import { UserModel } from "../models/user/user";
import { ProductModel } from "../models/vendor/productModel";
import { CartModel } from "../models/cart/Cart";
import { AdminProductModel } from "../models/admin/product/productAdminModel";
import { AdminFinancerOrderModel } from "../models/Order/adminFinancerOrder";
import { Request, Response, NextFunction } from "express";
import {
  getUserApprovedDocument,
  getUserUnapprovedDocument,
  getVendorApprovedDocument,
  ordersCount,
  productsCount,
  totalUsersCount,
} from "../helper/functions";

export const approveDocument = async (req: any, res: any) => {
  const { documentId } = req.params;
  const { userId } = req.body;

  try {
    // Find user document and update isVerified
    const userDocument = await UserDocumentModel.findOneAndUpdate(
      { _id: documentId },
      { $set: { isVerified: true } }
    );
    // Find vendor document and update isVerified
    const vendorDocument = await VendorDocumentModel.findOneAndUpdate(
      { _id: documentId },
      { $set: { isVerified: true } }
    );

    if (!userDocument && !vendorDocument) {
      return res.status(404).json({ error: "Document not found." });
    }
    const account = await UserModel.findOneAndUpdate(
      { userId: userId },
      { $set: { isVerified: true } }
    );

    // Return success response
    return res.status(201).json({
      message: "Document approved successfully.",
    });
  } catch (error) {
    console.error("Error during document approval:", error);
    // Return error response if approval fails
    return res.status(500).json({ error: "Document approval failed." });
  }
};

export const getUserDocument = async (req: any, res: any) => {
  try {
    // Find user document and update isVerified
    const userDocument = await UserDocumentModel.find();

    if (!userDocument) {
      return res.status(200).json({ documents: [] });
    } else {
      return res.status(200).json({ documents: userDocument });
    }
  } catch (error) {
    console.error("Error during document fetching:", error);
    // Return error response if approval fails
    return res.status(500).json({ error: "Document fetching failed." });
  }
};

export const getVendorDocument = async (req: any, res: any) => {
  try {
    // Find user document and update isVerified
    const userDocument = await VendorDocumentModel.find();

    if (!userDocument) {
      return res.status(200).json({ documents: [] });
    } else {
      return res.status(200).json({ documents: userDocument });
    }
  } catch (error) {
    console.error("Error during document fetching:", error);
    // Return error response if approval fails
    return res.status(500).json({ error: "Document fetching failed." });
  }
};
export const getVendorUnapprovedDocument = async (req: any, res: any) => {
  try {
    // Find user document and update isVerified
    const documents = await VendorDocumentModel.countDocuments({
      isVerified: false,
    });

    return res.status(200).json({ count: documents });
  } catch (error) {
    console.error("Error during document fetching:", error);
    // Return error response if approval fails
    return res.status(500).json({ error: "Document fetching failed." });
  }
};

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

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ error: "No items in cart." });
    }

    // Calculate the total price of items in the cart
    let totalPrice = 0;
    cart.items.forEach((item: any) => {
      const product = item.productId;
      if (product && product.price) {
        totalPrice += item.quantity * product.price;
      }
    });

    // Add the totalPrice to the cart object
    const cartWithTotal = {
      ...cart.toObject(),
      totalPrice,
    };

    return res.status(200).json({ cart: cartWithTotal });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const createAdminProduct = async (req: any, res: any) => {
  const {
    title,
    description,
    shortDescription,
    quantity,
    units,
    price,
    image,
    isAvailable,
    otherDetails,
  } = req.body;

  try {
    // Create a new product document using the ProductModel
    const newProduct = await AdminProductModel.create({
      title,
      description,
      shortDescription,
      quantity,
      units,
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

export const getOrderDetail = async (req: any, res: any) => {
  const { orderId } = req.params;

  try {
    const order = await AdminFinancerOrderModel.findById(orderId).populate(
      "items.productId"
    );

    if (!order) {
      return res.status(404).json({ error: "No orders available." });
    }

    return res.status(200).json({ order: order });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getParticularItem = async (req: Request, res: Response) => {
  const { productId } = req.params;
  // console.log("prodctId", productId)
  try {
    const product = await AdminProductModel.findById(productId);
    console.log("prdoct", product);

    if (!product) {
      return res.status(400).json({ error: "Product is unavailable!" });
    } else {
      return res.status(200).json({ product });
    }
  } catch (error) {
    console.error("Error fetching admin product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateProductStatus = async (req: any, res: any) => {
  const { orderId } = req.params;
  const { status, statusLabel } = req.body;

  try {
    // Fetch the order
    const order = await AdminFinancerOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Update the status of the order item
    order.status = status;

    // Update the order history
    order.history.push({
      status: statusLabel,
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
export const updatePaymentStatus = async (req: any, res: any) => {
  const { orderId } = req.params;
  try {
    // Fetch the order
    const order = await AdminFinancerOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Update the status of the order item
    order.isPaid = true;

    await order.save();

    // Return success response
    return res
      .status(200)
      .json({ message: "Order item payment status updated successfully." });
  } catch (error) {
    console.error("Failed to update order item status:", error);
    return res
      .status(500)
      .json({ error: "Failed to update order item status." });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const products = await AdminProductModel.find();
    console.log("products", products);

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

export const profileDetails = async (req: any, res: any) => {
  const { userId } = req.body;
  try {
    const report = await UserModel.findOne({
      userId: userId,
    });

    if (report) {
      return res.status(200).json({ report });
    }
  } catch (error) {
    console.error("Error fetch user report", error);
    return res.status(500).json({ error: "Error fetch user report" });
  }
};

export const reports = async (req: any, res: any) => {
  try {
    const totalUserApprovedDocuments = await getUserApprovedDocument();
    const totalUserUnapprovedDocuments = await getUserUnapprovedDocument();
    const totalVendorApprovedDocuments = await getVendorApprovedDocument();
    const totalVendorUnapprovedDocuments = await getVendorApprovedDocument();
    const ordersConfirmed = 0;
    const {
      totalOrders,
      totalUnpaidOrders,
      unpaidAmount,
      confirmedOrders,
      shippedOrders,
      outForDeliveryOrders,
      deliveredOrders,
    } = await ordersCount();

    const {vendorProductCount , adminProductCount} = await productsCount()

    const { usersCount, vendorsCount } = await totalUsersCount();

    // Return success response
    return res.status(200).json({
      usersCount,
      vendorsCount,
      totalUserApprovedDocuments,
      totalUserUnapprovedDocuments,
      totalVendorApprovedDocuments,
      totalVendorUnapprovedDocuments,
      vendorProductCount,
      adminProductCount,
      ordersConfirmed,
      totalOrders,
      totalUnpaidOrders,
      unpaidAmount,
      confirmedOrders,
      shippedOrders,
      outForDeliveryOrders,
      deliveredOrders,
    });
  } catch (error) {
    console.log("Failed to update order item status:", error);
    return res
      .status(500)
      .json({ error: "Failed to update order item status." });
  }
};
