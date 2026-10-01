import { Router } from "express";
import { BookFindAll, BookFindById } from "../repositories/books.repository.ts";
import { getBooks, PostBook } from "../controllers/books.controller.ts";
import { title } from "process";

export const routerBooks = Router();

routerBooks.get('/:id', async (req, res) => {
    const dataBook = await getBooks(req, res);
    res.send(dataBook)
});

routerBooks.get('/', async (req, res) => {
    const dataBooks = await BookFindAll();
    res.send(dataBooks);
})

routerBooks.post('/', async (req, res) => {
    await PostBook(req, res);
})


