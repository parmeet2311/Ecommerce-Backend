import { Schema, model, Document } from 'mongoose';

interface IDeliveryAddress extends Document {
  id:number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mob: string;
}

const deliveryAddressSchema = new Schema<IDeliveryAddress>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  mob: { type: String, required: true }
});

export const DeliveryAddressModel = model<IDeliveryAddress>('DeliveryAddress', deliveryAddressSchema);
