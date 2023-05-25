import { Router } from "express";
import { check } from "express-validator";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";
import {
  fieldsValidator,
  jwtValidator,
  hasRole,
  isAdmin,
} from "../middlewares/index.js";
import { existsCategoryById } from "../helpers/db-validators.js";

export const categoryRouter = Router();

//Public - et all categories -
categoryRouter.get("/", getCategories);

//Public - Get category by id
categoryRouter.get(
  "/:id",
  [
    check("id", "It is not a Mongo Valid Id").isMongoId(),
    check("id").custom(existsCategoryById),
    fieldsValidator,
  ],
  getCategory
);

//Private with valid token - create category
categoryRouter.post(
  "/",
  [
    jwtValidator,
    check("name", "Name is required").not().isEmpty(),
    fieldsValidator,
  ],
  createCategory
);

//Private with valid token - update category
categoryRouter.put("/:id",
  [
    jwtValidator,
    check("name", "Name is required").not().isEmpty(),
    check("id", "It is not a Mongo Valid Id").isMongoId(),
    check("id").custom(existsCategoryById),
    fieldsValidator,
  ],
  updateCategory
);

//Private Admin - delete category
categoryRouter.delete("/:id", [
    jwtValidator,
    isAdmin,
    check("id", "It is not a Mongo Valid Id").isMongoId(),
    check("id").custom(existsCategoryById),
    fieldsValidator,
], deleteCategory);
