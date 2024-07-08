import { Schema, model, Document, ObjectId } from "mongoose";

interface IImage extends Document {
  ImageURL: string;
}

interface IProduct extends Document {
  title: string;
  description: string;
  shortDescription: string;
  image: IImage[];
  quantity: number;
  units:string;
  price: number;
  isAvailable: boolean; 
  otherDetails: ("30-day Free Return" | "Buyer Protection" | "Best Deal" | "Ship to store")[];
  createdAt?: Date;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, "Product must have a name"],
  },
  description: {
    type: String,
    required: [true, "Product must have a description"],
  },
  shortDescription: {
    type: String,
    required: [true, "Product must have a short description"],
  },
  image: [
    {
      ImageURL: {
        type: String,
      }
    },
  ],
  quantity: {
    type: Number,
    required: true,
  },
  units: {
    type: String,
    enum:["can","kg", "gm", "ltr", "none"],
    required: [true, "Product must have a short description"],
  },
  price: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
    required: true,
  },
  otherDetails: [
      {
        type: String,
        enum: [
          "30-day Free Return",
          "Buyer Protection",
          "Best Deal",
          "Ship to store",
        ], // Restricts status to only these values
      },
  ],
  createdAt: { type: Date, default: Date.now },
});

productSchema.pre('save', function (next) {
  this.title = this.title.toLowerCase();
  next();
});

// Pre-save hook to auto-increment userId
productSchema.pre<IProduct>("save", async function (next) {
  next();
});

export const AdminProductModel = model<IProduct>("AdminProduct", productSchema);
