import { Router } from "express";
import { login, register } from "../controllers/users.controller.js";

export const routerUsers = Router();

routerUsers.post("/register", register);
routerUsers.post("/login", login);
