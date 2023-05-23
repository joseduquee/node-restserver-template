import { Router } from "express";
import { check } from "express-validator";
import { fieldsValidator } from "../middlewares/fields-validator.js";
import { uploadFile } from "../controllers/upload.controller.js";


export const uploadRouter = Router();

uploadRouter.post('/', uploadFile);