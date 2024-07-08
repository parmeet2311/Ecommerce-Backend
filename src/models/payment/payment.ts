import { Schema, model, Document } from "mongoose";

interface IPayment extends Document {
  orderId: string; // Reference to the order ID
  purchaseProductId: string;
  amount: number;
  txn: string;
  paymentImg: string;
}

const paymentSchema = new Schema<IPayment>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true } as any,
  purchaseProductId: { type: Schema.Types.ObjectId, required: true } as any,
  amount: { type: Number, required: true },
  txn: { type: String, required: true },
  paymentImg: { type: String, required: true },
});

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
