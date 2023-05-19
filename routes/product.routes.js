import { Router } from "express";
import { check } from "express-validator";
import {
    fieldsValidator,
    jwtValidator,
    hasRole,
    isAdmin,
  } from "../middlewares/index.js";
import { createProduct, getProduct, getProducts, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { existsCategoryById, existsProductById } from "../helpers/db-validators.js";


export const productRouter = Router();

//Public - Get all products -
productRouter.get("/", getProducts);

//Public - Get category by id
productRouter.get(
  "/:id",
  [
    check("id", "It is not a Mongo Valid Id").isMongoId(),
    check("id").custom( existsProductById ),
    fieldsValidator,
  ],
  getProduct
);

//Private with valid token - create category
productRouter.post(
  "/",
  [
    jwtValidator,
    check("name", "Name is required").not().isEmpty(),
    check("category", "It is not an Mongo Id").isMongoId(),
    check("category").custom( existsCategoryById ),
    fieldsValidator,
  ],
  createProduct
);

//Private with valid token - update category
productRouter.put("/:id",
  [
    jwtValidator,
    check("id").custom(existsProductById),
    check("id", "It is not a Mongo Valid Id").isMongoId(),
    fieldsValidator,
  ],
  updateProduct
);

//Private Admin - delete category
productRouter.delete("/:id", [
    jwtValidator,
    isAdmin,
    check("id", "It is not a Mongo Valid Id").isMongoId(),
    check("id").custom(existsProductById),
    fieldsValidator,
], deleteProduct);