import { Router } from "express";
import { usersDelete, usersGet, usersPath, usersPost, usersPut } from "../controllers/users.controller.js";

export const router = Router();

router.get("/", usersGet);

router.post("/", usersPost);

router.put("/:id", usersPut);

router.patch("/", usersPath);

router.delete("/", usersDelete);
