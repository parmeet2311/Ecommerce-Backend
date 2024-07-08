import jwt from "jsonwebtoken";
import { UserModel } from "../models/user/user";
import bcrypt from "bcrypt";
import { adminAddresses } from "../data/adminAddresses";

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];

  console.log("token", token)
  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }

    // If everything is good, save to request for use in other routes
    req.userId = decoded.userId;
    next();
  });
};

export const validateSignupData = async (req: any, res: any, next: any) => {
  const { email, fullName, role, phoneNum, password, confirmPassword } =
    req.body;

  // Check if all required fields are present
  if (
    !email ||
    !password ||
    !confirmPassword ||
    !role ||
    !fullName ||
    !phoneNum
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if username already exists
  const existingUser = await UserModel.findOne({ email: email });

  if (existingUser) {
    return res.status(400).json({ error: "Email already exists." });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Validate mobile number format (assuming 10 digits)
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(phoneNum)) {
    return res.status(400).json({ error: "Invalid mobile number format." });
  }

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "Password and confirm password do not match." });
  }

  // Optionally, you can perform additional validation here

  // If all validation passes, proceed to the next middleware or the signup endpoint
  next();
};

export const validateLoginData = async (req: any, res: any, next: any) => {
  const { email, password } = req.body;

  // Check if both username and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    // Find the user by username
    const user = await UserModel.findOne({ email: email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check if the user object has a password field
    if (!user.password) {
      return res.status(500).json({ error: "User password not found." });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // If both username and password are valid, proceed to the next middleware or the login endpoint
    next();
  } catch (error) {
    console.error("Error during login validation:", error);
    return res.status(500).json({ error: "Login validation failed." });
  }
};

// is admin

// Middleware to verify if the user is an admin
export const isAdmin = async (req: any, res: any, next: any) => {
  const { adminId } = req.body;
  try {
    // Extract token from request headers

    console.log("userId", adminId);

    const user = await UserModel.findOne({ userId: Number(adminId) });

    // Check if the sponsor ID belongs to an admin
    if (!adminAddresses.includes(user.email)) {
      return res
        .status(403)
        .json({ error: "Only admins can access this endpoint" });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying admin status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
