import { Request, Response, NextFunction } from "express";
import { VendorDocumentModel } from "../models/admin/documents/vendorDocument";
import { UserModel } from "../models/user/user";
import { ProductModel } from "../models/vendor/productModel";

export const validateVendorSubmitDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  // Check if user exists
  const existingUser = await UserModel.findOne({ userId });
  if (!existingUser) {
    return res.status(400).json({ error: "You are not registered!" });
  }

  // Check if document already exists for the user
  const existingDocument = await VendorDocumentModel.findOne({ userId });
  if (existingDocument) {
    return res
      .status(400)
      .json({ error: "Document already exists for this user." });
  }

  // Check if all fields are entered
  const requiredFields = [
    "userId",
    "username",
    "email",
    "mobNum",
    "dob",
    "businessName",
    "businessEmail",
    "address",
    "pincode",
    "state",
    "panNumber",
    "aadharNum",
    "gstNum",
    "aadharFrontImgUrl",
    "aadharBackImgUrl",
    "panImgUrl",
    "gstImgUrl",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Validate mobile number format (assuming 10 digits)
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobNum)) {
    return res.status(400).json({ error: "Invalid mobile number format." });
  }

  try {
    next();
  } catch (error) {
    console.error("Error checking document existence:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const validateCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  // Check if user exists
  const existingUser = await UserModel.findOne({ userId: vendorId });
  if (!existingUser) {
    return res.status(400).json({ error: "You are not registered!" });
  }
  if (existingUser.role != "vendor") {
    return res.status(400).json({ error: "You are not vendor!" });
  }
  // Check if a product with the same title already exists for the user
  const lowercaseTitle = title.toLowerCase();
  const existingProduct = await ProductModel.findOne({
    vendorId,
    title: lowercaseTitle,
  });
  if (existingProduct) {
    return res
      .status(400)
      .json({ error: "Product with this title already exists." });
  }

  // Check if all fields are entered
  const requiredFields = [
    "vendorId",
    "title",
    "description",
    "shortDescription",
    "quantity",
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
