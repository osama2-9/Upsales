import { Router } from "express";

import { signup, login, logout } from "../controllers/authController.js";
import { validate } from "../middlewares/zodValidate.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";
const router = Router();
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;
export { router as authRouter };
