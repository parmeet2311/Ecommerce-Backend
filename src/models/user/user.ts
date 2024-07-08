import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  userId: number;
  fullName: string;
  email: string;
  password: string;
  phoneNum:Number;
  isVerified: boolean;
  role: string;
  dateRegistered?: Date;
  lastUpdatedDate: Date; // Add this line to include lastUpdatedDate
}

const UserSchema = new Schema<IUser>({
  userId: {
    type: Number,
    unique: true,
  },
  fullName: {
    type:String,
    required:true
  },
  email: {
    type:String,
    required:true
  },
  phoneNum: {
    type: Number,
    required: [true, "Phone number is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["admin", "user", "vendor"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  dateRegistered: { type: Date, default: Date.now },
  lastUpdatedDate: { type: Date, default: Date.now },
});

export const UserModel = model<IUser>("User", UserSchema);
