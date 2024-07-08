import { Request, Response, NextFunction } from 'express';
import { VendorDocumentModel } from '../models/admin/documents/vendorDocument';
import { UserDocumentModel } from '../models/admin/documents/userDocument';
import { UserModel } from '../models/user/user';
import { CartModel } from '../models/cart/Cart';
import { AdminProductModel } from '../models/admin/product/productAdminModel';

export const validateUserSubmitDocument = async (req: Request, res: Response, next: NextFunction) => {
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
    state
  } = req.body;

   // Check if user exists
   const existingUser = await UserModel.findOne({ userId });
   if (!existingUser) {
     return res.status(400).json({ error: 'You are not registered!' });
   }

  // Check if document already exists for the user
  const existingDocument = await UserDocumentModel.findOne({ userId });
  if (existingDocument) {
    return res.status(400).json({ error: 'Document already exists for this user.' });
  }

  // Check if all fields are entered

  const requiredFields = ['userId', 'username', 'email', 'mobNum', 'dob', 'businessName', 'businessEmail', 'address', 'pincode', 'state'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Validate mobile number format (assuming 10 digits)
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobNum)) {
    return res.status(400).json({ error: 'Invalid mobile number format.' });
  }

  try {
    
    next();
  } catch (error) {
    console.error('Error checking document existence:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const checkAdminProductQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Fetch the product from the database
    const product = await AdminProductModel.findById(productId);
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
