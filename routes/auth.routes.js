import { Router } from "express";
import { check } from "express-validator";
import { googleSignIn, login } from "../controllers/auth.controller.js";
import { fieldsValidator } from "../middlewares/fields-validator.js";

export const authRouter = Router();

authRouter.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    fieldsValidator
], login);

authRouter.post('/google', [
    check('id_token', 'Id token is require').not().isEmpty(),
    fieldsValidator
], googleSignIn);