import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userAuth } from "./routes/auth";
import { userAction } from "./routes/user";
import { adminAction } from "./routes/admin";
import { vendorAction } from "./routes/vendor";
import { addressAction } from "./routes/address";
import * as dotenv from "dotenv";
import { financerAction } from "./routes/financer";


// Import jwt and users data
import jwt from "jsonwebtoken";
import { UserModel } from "./models/user/user";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.get("/", async (req, res) => {
  res.send("Hello Developers");
});
app.use("/auth", userAuth);
app.use("/user", userAction);
app.use("/admin", adminAction);
app.use("/vendor", vendorAction);
app.use("/financer", financerAction);
app.use("/address", addressAction);

// Define the route handler for /auth/me endpoint
app.get("/auth/me", async (req, res) => {
  // Get the token from the request headers
  const token = req.headers.authorization;
  console.log(token);
  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    // Extract the user ID from the token payload
    const userId = decoded.userId;
    
    const user = await UserModel.findOne({userId:Number(userId)});
   

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    // Remove sensitive fields from the user object
    const userData = { ...user };


    return res.status(200).json({ userData });
  } catch (err) {
    // Handle token verification errors
    return res.status(401).json({ error: "Invalid token" });
  }
});



mongoose.connect(process.env.MONGO);

app.listen(process.env.PORT || 5000, () =>
  console.log("Server started at port:", process.env.PORT)
);
