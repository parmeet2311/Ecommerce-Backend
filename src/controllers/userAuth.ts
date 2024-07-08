import { UserModel } from "../models/user/user";
import { generateUniqueUserId } from "../helper/functions";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req: any, res: any) => {
  const { email, fullName, role, phoneNum, password, confirmPassword } =
    req.body;

  try {
    // Generate a 6-digit unique userId
    const userId = await generateUniqueUserId();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

    const userDetails = {
      userId: userId,
      email,
      phoneNum,
      password: hashedPassword,
      fullName: fullName,
      role: role,
    };

    // Perform user registration logic here, save userDetails to the database, etc.
    const newUser = new UserModel(userDetails);

    await newUser.save();

    // Assuming user registration is successful, generate JWT token
    const token = jwt.sign(
      { email: email, userId: userId },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(201).json({
      message: "User Registration successful.",
      token: token,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(200).json({ error: "Registration failed." });
  }
};
const capitalizeFirstLetter = (str) => {
  // Convert the string to lowercase and split it into words
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      // Capitalize the first letter of each word and make the rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" "); // Join the words back into a string
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ email: email });

    // If the password matches, generate JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        fullName: capitalizeFirstLetter(user.fullName),
      },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      accessToken: token,
      userData: user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Login failed." });
  }
};
