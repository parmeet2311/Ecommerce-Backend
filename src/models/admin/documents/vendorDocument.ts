import { Schema, model, Document } from "mongoose";

interface IUserDetail extends Document {
  username: string;
  email: string;
  mobNum: number;
  dob: string;
}
interface IBusinessDetail extends Document {
  businessName: string;
  businessEmail: string;
  address: string;
  pincode: number;
  state: string;
}

interface IDocumentDetail extends Document {
    panNumber: string;
    aadharNum: string;
    gstNum: string;
    aadharFrontImgUrl: string;
    aadharBackImgUrl: string;
    panImgUrl: string;
    gstImgUrl: string;
  }

export interface IDocument extends Document {
  userId: number;
  isVerified:Boolean;
  userDetails: IUserDetail;
  businessDetails: IBusinessDetail;
  documentDetails:IDocumentDetail;
  createdAt?: Date;
  lastUpdatedDate: Date; // Add this line to include lastUpdatedDate
}

const DocumentSchema = new Schema<IDocument>({
  userId: {
    type: Number,
    unique: true,
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  userDetails: {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobNum: {
      type: Number,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
  },
  businessDetails: {
    businessName: {
      type: String,
      required: true,
    },
    businessEmail: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  documentDetails:{
    panNumber: {
        type: String,
        required:true
    },
    aadharNum: {
        type: String,
        required:true
    },
    gstNum: {
        type: String,
        required:true
    },
    aadharFrontImgUrl: {
        type: String,
        required:true
    },
    aadharBackImgUrl: {
        type: String,
        required:true
    },
    panImgUrl: {
        type: String,
        required:true
    },
    gstImgUrl: {
        type: String,
        required:true
    },
  },
  createdAt: { type: Date, default: Date.now },
  lastUpdatedDate: { type: Date, default: Date.now },
});

export const VendorDocumentModel = model<IDocument>(
  "VendorDocument",
  DocumentSchema
);
