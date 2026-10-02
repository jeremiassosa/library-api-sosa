import { Request, Response } from "express";
import { BookFindById } from "../repositories/books.repository.ts";
import { createBook, getAll, getById, remove, updateBook } from "../services/books.services.ts";

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

export async function DeleteBook(req: Request, res: Response) {
    const { id } = req.params;
    const bookId = Number(id)
    
    if (Number.isNaN(bookId)) {
        res.status(400).json({ "error": "ID is not a number" })
        return;
    } 
    
    const response = await remove(bookId);
    if (response === "BOOK_NOT_FOUND"){
        res.status(404).json({ "error": "BOOK_NOT_FOUND" })
        return;
    } else {
        res.status(204).send({response});
        return; 
    }
}


export async function PutBook(req: Request, res: Response) {
    const { id } = req.params;
    const bookId = Number(id);
    const { title, year, author_id } = req.body;
    

    if (Number.isNaN(bookId)) {
        res.status(400).json({ "error": "ID is not a number" })
        return;
    }

    const yearNum = Number(year);
    const authorIdNum = Number(author_id);

    if (Number.isNaN(yearNum)) {
        res.status(400).json({ "error": "Year is not a number" })
        return;
    } else {
        if (Number.isNaN(authorIdNum)) {
            res.status(400).json({ "error": "Author ID is not a number" })
            return;
        } else {
            const bookData = await updateBook(bookId, { title: title, year: parseInt(year), author_id: parseInt(author_id)});

            if (!bookData) {
                res.status(404).json({ "error": "BOOK_NOT_FOUND" })
                return;
            } else {
                res.json(bookData);
                return;
            }
        }
    }
}

export async function PatchBook(req: Request, res: Response) {
    const { id } = req.params;
    const bookId = Number(id);
    const { title, year, author_id } = req.body;

    if (Number.isNaN(bookId)) {
        res.status(400).json({ "error": "ID is not a number" })
        return;
    }

    const data:any = {};

    if (title !== undefined) {
        data.title = title;
    }

    if (year !== undefined) {
        const yearNum = Number(year);

        if (Number.isNaN(yearNum)) {
            res.status(400).json({ "error": "Year is not a number" })
            return;
        } else {
            data.year = parseInt(year);
        }
    }

    if (author_id !== undefined) {
        const authorIdNum = Number(author_id);

        if (Number.isNaN(authorIdNum)) {
            res.status(400).json({ "error": "Author ID is not a number" })
            return;
        } else {
            data.author_id = parseInt(author_id);
        }
    }

    const bookData = await updateBook(bookId, data);

    if (!bookData) {
        res.status(404).json({ "error": "BOOK_NOT_FOUND" })
        return;
    } else {
        res.json(bookData);
        return;
    }
}