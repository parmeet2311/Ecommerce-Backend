import { Schema, model, Document, Types } from "mongoose";

interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  status: string;
  isPaid: boolean;
  amountPaid: number;
}

interface IOrderHistory {
  status: string;
  updatedAt: Date;
}

export interface IFinancerOrder extends Document {
  userId: number;
  items: IOrderItem[];
  totalAmount: number;
  status: string;
  history: IOrderHistory[];

  updateItemQuantity(itemId: Types.ObjectId, quantity: number): Promise<void>;
  deleteItem(itemId: Types.ObjectId): Promise<void>;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  isPaid: { type: Boolean, default: false },
  amountPaid: { type: Number, default: 0 },
});

const orderHistorySchema = new Schema<IOrderHistory>({
  status: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const orderSchema = new Schema<IFinancerOrder>({
  userId: { type: Number, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  history: [orderHistorySchema],
});

orderSchema.methods.updateItemQuantity = async function (
  this: IFinancerOrder,
  itemId: Types.ObjectId,
  quantity: number
) {
  const orderItem = this.items.find(item => item.productId.equals(itemId));
  if (!orderItem) {
    throw new Error("Order item not found.");
  }

  orderItem.quantity = quantity;
  await this.save();
};

orderSchema.methods.deleteItem = async function (
  this: IFinancerOrder,
  itemId: Types.ObjectId
) {
  this.items = this.items.filter(item => !item.productId.equals(itemId));
  await this.save();
};

export const FinancerOrderModel = model<IFinancerOrder>("FinancerOrder", orderSchema);
