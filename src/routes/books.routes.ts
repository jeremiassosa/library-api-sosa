import { Router } from "express";
import { DeleteBook, getAllBooks, getBooks, PatchBook, PostBook, PutBook } from "../controllers/books.controller.js";

export const routerBooks = Router();

routerBooks.get("/", getAllBooks);
routerBooks.get("/:id", getBooks);
routerBooks.post("/", PostBook);
routerBooks.delete("/:id", DeleteBook);
routerBooks.put("/:id", PutBook);
routerBooks.patch("/:id", PatchBook);
