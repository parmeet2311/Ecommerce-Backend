import { ProductModel } from "../models/vendor/productModel";
import { VendorDocumentModel } from "../models/admin/documents/vendorDocument";
import { Request, Response, NextFunction } from "express";
import { OrderModel } from "../models/Order/vendorOrder";
import { PaymentModel } from "../models/payment/payment";

export const sendPayment = async (req: Request, res: Response) => {
    const {
      orderId,
      purchaseProductId,
      amount,
      txn,
      paymentImg
    } = req.body;
  
    try {
      // Fetch the order
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }
  
      // Find the specific order item
      const orderItem = order.items.find(item => item.productId.toString() === purchaseProductId);
      if (!orderItem) {
        return res.status(404).json({ error: 'Order item not found.' });
      }

      
      if (orderItem.isPaid == true) {
        return res.status(400).json({ error: 'You have already paid!' });
      }
  
      // Check if the amount is correct
      const correctAmount = orderItem.quantity * orderItem.price;
      if (amount !== correctAmount) {
        return res.status(400).json({ error: `Incorrect amount. Please enter the correct amount. Total pending amount: $${correctAmount}` });
      }
  
      // Update order item status to 'Paid' and set isPaid to true
      orderItem.status = 'Paid';
      orderItem.amountPaid = amount; // Assuming you want to store the amount paid
      orderItem.isPaid = true;
  
      // Add payment details to the Payment collection
      const payment = new PaymentModel({
        orderId,
        purchaseProductId,
        amount,
        txn,
        paymentImg
      });
      await payment.save();
  
      // Add payment transaction details to the order history
      orderItem.history.push({ status: `Payment sent: ${txn}`, updatedAt: new Date() });
  
      await order.save();
  
      // Return success response
      return res.status(201).json({ message: 'Successfully shared transaction details.' });
    } catch (error) {
      console.error('Failed to execute transaction:', error);
      return res.status(500).json({ error: 'Failed to execute transaction.' });
    }
  };
