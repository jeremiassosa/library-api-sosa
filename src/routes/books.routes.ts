import { Router } from "express";
import { DeleteBook, getAllBooks, getBooks, PatchBook, PostBook, PutBook } from "../controllers/books.controller.js";
import { authenticateToken, authorizeRole } from "../middleware/user.auth.js";

export const routerBooks = Router();


routerBooks.get("/", authenticateToken, getAllBooks);
routerBooks.get("/:id", authenticateToken, getBooks);
routerBooks.post("/", authenticateToken, authorizeRole("admin"), PostBook);
routerBooks.delete("/:id", authenticateToken, authorizeRole("admin"), DeleteBook);
routerBooks.put("/:id", authenticateToken, authorizeRole("admin"), PutBook);
routerBooks.patch("/:id", authenticateToken, authorizeRole("admin"), PatchBook);
