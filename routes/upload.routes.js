import { Router } from "express";
import { check } from "express-validator";
import { fieldsValidator, fileValidate } from "../middlewares/index.js";
import { showImage, updateImagesCloudinary, uploadFile } from "../controllers/upload.controller.js";
import { collectionsAllow } from "../helpers/index.js";

export const uploadRouter = Router();

uploadRouter.post("/", fileValidate, uploadFile);

uploadRouter.put(
  "/:collection/:id",
  [
    fileValidate,
    check("id", "Id must be a MongoId").isMongoId(),
    check("collection").custom((c) =>
      collectionsAllow(c, ["users", "products"])
    ),
    fieldsValidator,
  ],
  updateImagesCloudinary
);

uploadRouter.get("/:collection/:id", [
  check("id", "Id must be a MongoId").isMongoId(),
  check("collection").custom((c) => collectionsAllow(c, ["users", "products"])),
  fieldsValidator,
], showImage);
