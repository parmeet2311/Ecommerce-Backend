import { UserModel } from "../models/user/user";
import { UserDocumentModel } from "../models/admin/documents/userDocument";
import { VendorDocumentModel } from "../models/admin/documents/vendorDocument";
import { ProductModel } from "../models/vendor/productModel";
import { AdminProductModel } from "../models/admin/product/productAdminModel";
import { AdminFinancerOrderModel } from "../models/Order/adminFinancerOrder";

// Function to generate a 6-digit unique userId
export const generateUniqueUserId = async () => {
  while (true) {
    const userId = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
    const existingUser = await UserModel.findOne({ userId: userId }); // Check if the generated userId already exists
    if (!existingUser) {
      return userId; // If userId is unique, return it
    }
  }
};

export const getUserUnapprovedDocument = async () => {
  // Find user document and update isVerified
  const documents = await UserDocumentModel.countDocuments({
    isVerified: false,
  });

  return documents;
};
export const getUserApprovedDocument = async () => {
  // Find user document and update isVerified
  const documents = await UserDocumentModel.countDocuments({
    isVerified: true,
  });

  return documents;
};

export const getVendorUnapprovedDocument = async () => {
  // Find user document and update isVerified
  const documents = await VendorDocumentModel.countDocuments({
    isVerified: false,
  });

  return documents;
};
export const getVendorApprovedDocument = async () => {
  // Find user document and update isVerified
  const documents = await VendorDocumentModel.countDocuments({
    isVerified: true,
  });

  return documents;
};

export const totalUsersCount = async () => {
  // Find user document and update isVerified
  const usersCount = await UserModel.countDocuments({ role: "user" });
  const vendorsCount = await UserModel.countDocuments({ role: "vendor" });

  return { usersCount, vendorsCount };
};
export const productsCount = async () => {
  // Find user document and update isVerified
  const vendorProductCount = await ProductModel.countDocuments();
  const adminProductCount = await AdminProductModel.countDocuments();

  return { vendorProductCount, adminProductCount };
};

export const ordersCount = async () => {
  // Find user document and update isVerified
 
  const totalOrders = await AdminFinancerOrderModel.countDocuments();
  const totalUnpaidOrders = await AdminFinancerOrderModel.find({isPaid:false}).countDocuments();
   // Aggregate to find the total unpaid amount
   const unpaidAggregation = await AdminFinancerOrderModel.aggregate([
    { $match: { isPaid: false } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" } // assuming 'amount' field holds the order amount
      }
    }
  ]);

  // Extract the total unpaid amount from the aggregation result
  const unpaidAmount = unpaidAggregation.length ? unpaidAggregation[0].totalAmount : 0;

  const confirmedOrders = await AdminFinancerOrderModel.find({status:'Order Confirmed'}).countDocuments();
  const shippedOrders = await AdminFinancerOrderModel.find({status:'Order Shipped'}).countDocuments();
  const outForDeliveryOrders = await AdminFinancerOrderModel.find({status:"Out for delivery"}).countDocuments();
  const deliveredOrders = await AdminFinancerOrderModel.find({status:"Delivered"}).countDocuments()

  

  return { totalOrders, totalUnpaidOrders,unpaidAmount, confirmedOrders, shippedOrders, outForDeliveryOrders, deliveredOrders };
};
