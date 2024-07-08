import { Schema, model, Document, Types } from "mongoose";

interface IOrderItem {
  // _id: Types.ObjectId;
  productId: Types.ObjectId;
  vendorId: number;
  quantity: number;
  price: number;
  status: string;
  amountPaid: number;
  isPaid: boolean;
  history: IOrderHistory[];
}

interface IOrderHistory {
  status: string;
  updatedAt: Date;
}
interface IAddress extends Document {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mob: string;
}
interface IOrder extends Document {
  userId: number;
  items: IOrderItem[];
  totalAmount: number;
  deliveryAddress:IAddress;
  status: string;
}


const orderHistorySchema = new Schema<IOrderHistory>({
  status: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const orderItemSchema = new Schema<IOrderItem>({
  // _id: { type: Schema.Types.ObjectId, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  vendorId: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  amountPaid: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  history: [orderHistorySchema],
});

const orderSchema = new Schema<IOrder>({
  userId: { type: Number, required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    mob: { type: String, required: true },
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
});

export const OrderModel = model<IOrder>("Order", orderSchema);
