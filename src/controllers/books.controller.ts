import { Request, Response } from "express";
import { BookFindById } from "../repositories/books.repository.ts";
import { createBook, getAll, getById } from "../services/books.services.ts";

export async function getBooks(req: Request, res: Response) {
    const { id } = req.params;
    const bookId = Number(id)

    const bookData = await getById(bookId, res);

    if (!bookData){
        res.status(404).json({ "error": "Book not found" })
        return;
    } else {
        return res.json(bookData);
    }
}
export async function getAllBooks(req: Request, res: Response) {
    
    const booksData = await getAll();
    
    if (!booksData){
        res.status(404).json({ "error": "Book not found" })
        return;
    } else {
    res.json(booksData);
    return
    }
}

export async function PostBook(req: Request, res:Response) {
        const {title, year, author_id} = req.body;
        const yearNum = Number(year);
        const authorIdNum = Number(author_id);

        if (Number.isNaN(yearNum)) {
            res.status(400).json({ "error": "Year is not a number" })
            return;
        } else { 
            if (Number.isNaN(authorIdNum)){
                res.status(400).json({ "error": "Author ID is not a number" })
                return;
            } else {
                const newBookData = await createBook(title, parseInt(year), parseInt(author_id));
                return res.status(201).json(newBookData);
            } 
        }
}

