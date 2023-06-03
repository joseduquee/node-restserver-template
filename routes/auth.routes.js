import { Router } from "express";
import { check } from "express-validator";
import { googleSignIn, login, renovateToken } from "../controllers/auth.controller.js";
import { fieldsValidator, jwtValidator } from "../middlewares/index.js";

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

authRouter.get('/', jwtValidator, renovateToken)