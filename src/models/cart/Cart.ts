import { Schema, model, Document, Types } from "mongoose";

interface ICartItem {
  productId: Types.ObjectId; // Change type to Types.ObjectId
  quantity: number;
}

interface ICart extends Document {
  userId: number;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "VendorProduct", required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
  userId: { type: Number, required: true },
  items: [cartItemSchema],
});

export const CartModel = model<ICart>("Cart", cartSchema);
