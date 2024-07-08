import { Schema, model, Document, Types } from "mongoose";

interface IAdminOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  status: string;
  // isPaid: boolean;
  amountPaid: number;
}

interface IAdminOrderHistory {
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

interface IAdminOrder extends Document {
  financerId: number;
  items: IAdminOrderItem[];
  totalAmount: number;
  status: string;
  history: IAdminOrderHistory[];
  isPaid: Boolean;
  deliveryAddress:IAddress;
  createdAt: Date;
}

const adminOrderItemSchema = new Schema<IAdminOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "AdminProduct", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  // isPaid: { type: Boolean, default: false },
  amountPaid: { type: Number, default: 0 },
});

const adminOrderHistorySchema = new Schema<IAdminOrderHistory>({
  status: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const adminOrderSchema = new Schema<IAdminOrder>({
  financerId: { type: Number, required: true },
  items: [adminOrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  history: [adminOrderHistorySchema],
  isPaid: { type: Boolean, default: false },
  deliveryAddress: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    mob: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export const AdminFinancerOrderModel = model<IAdminOrder>(
  "AdminFinancerOrder",
  adminOrderSchema
);
