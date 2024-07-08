import express from "express";
import { signup, login } from "../controllers/userAuth";
import { validateSignupData, validateLoginData } from "../middleware/middleware";
// import { register, registerByReferral } from "../controllers/userAuth";
const router = express.Router();

router.post("/signup", validateSignupData, signup);

router.post("/login", validateLoginData, login);

// router.post("/register", register);

export { router as userAuth };
