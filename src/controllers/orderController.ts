import { Request, Response } from 'express';
import { CartModel } from '../models/cart/Cart';
import { OrderModel } from '../models/Order/vendorOrder';

export const placeOrder = async (req: Request, res: Response) => {
  const { userId, name, address, city, state, pincode, mob  } = req.body;

  try {
    // Fetch the cart items for the user
    const cart = await CartModel.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ error: 'No items in cart.' });
    }
    if(!name || !address || !city || !state || !pincode || !mob){
      return res.status(404).json({ error: 'Delivery address is incomplete!' });
    }

    const orderItems = cart.items.map((item) => {
      const product = item.productId as any; // Adjust type accordingly
      return {
        productId: product._id,
        vendorId: product.vendorId,
        quantity: item.quantity,
        price: product.price,
        history: [{ status: 'Order placed', updatedAt: new Date() }],
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new OrderModel({
      userId,
      items: orderItems,
      totalAmount,
      deliveryAddress:{
        id: userId,
        name: name,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        mob: mob,
      },
      status: 'Pending',
    });

    await order.save();

    // Clear the cart after placing the order
    await CartModel.findOneAndDelete({ userId });

    return res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};