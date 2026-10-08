import { Request, Response } from "express";
import { createBook, getAll, getById, remove, updateBook } from "../services/books.services.js";
import { BookFilters, NewBook, UpdateBook } from "../types/book.js";

function getNumber(value: unknown): number | null {
    if (typeof value !== "string" || value.trim() === "") {
        return null;
    }

    const number = Number(value);
    return Number.isInteger(number) ? number : null;
}

function validBookData(data: NewBook): string | null {
    if (typeof data.title !== "string" || data.title.trim().length < 1 || data.title.length > 200) {
        return "Invalid title";
    }

    if (!Number.isInteger(data.year) || data.year < 1000 || data.year > 2100) {
        return "Invalid year";
    }

    if (!Number.isInteger(data.author_id) || data.author_id < 1) {
        return "Invalid author_id";
    }

    return null;
}

export async function getBooks(req: Request, res: Response) {
    const id = getNumber(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: "Id is not a number" });
    }

    const book = await getById(id);

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    return res.json({ data: book });
}

export async function getAllBooks(req: Request, res: Response) {
    const page = req.query.page === undefined ? 1 : getNumber(req.query.page);
    const limit = req.query.limit === undefined ? 10 : getNumber(req.query.limit);

    if (page === null || page < 1 || limit === null || limit < 1) {
        return res.status(400).json({ error: "Invalid page or limit" });
    }

    const filters: BookFilters = {};

    if (req.query.title !== undefined) {
        if (typeof req.query.title !== "string") {
            return res.status(400).json({ error: "Invalid title" });
        }
        filters.title = req.query.title;
    }

    if (req.query.available !== undefined) {
        if (req.query.available !== "true" && req.query.available !== "false") {
            return res.status(400).json({ error: "Invalid available" });
        }
        filters.available = req.query.available === "true";
    }

    if (req.query.author_id !== undefined) {
        const authorId = getNumber(req.query.author_id);
        if (authorId === null || authorId < 1) {
            return res.status(400).json({ error: "Invalid author_id" });
        }
        filters.author_id = authorId;
    }

    const result = await getAll(filters, {
        page,
        limit: Math.min(limit, 50),
    });

    return res.json(result);
}

export async function PostBook(req: Request, res: Response) {
    const data: NewBook = {
        title: req.body.title,
        year: Number(req.body.year),
        author_id: Number(req.body.author_id),
    };

    const validationError = validBookData(data);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const result = await createBook(data);

    if (result === "AUTHOR_NOT_FOUND") {
        return res.status(404).json({ error: "Author not found" });
    }

    return res.status(201).json({ data: result });
}

export async function DeleteBook(req: Request, res: Response) {
    const id = getNumber(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: "Id is not a number" });
    }

    const result = await remove(id);

    if (result === "BOOK_NOT_FOUND") {
        return res.status(404).json({ error: "Book not found" });
    }

    if (result === "BOOK_HAS_LOANS") {
        return res.status(409).json({ error: "Book has loans" });
    }

    return res.sendStatus(204);
}

export async function PutBook(req: Request, res: Response) {
    const id = getNumber(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: "Id is not a number" });
    }

    const data: NewBook = {
        title: req.body.title,
        year: Number(req.body.year),
        author_id: Number(req.body.author_id),
    };

    const validationError = validBookData(data);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const result = await updateBook(id, data);

    if (result === "BOOK_NOT_FOUND") {
        return res.status(404).json({ error: "Book not found" });
    }

    if (result === "AUTHOR_NOT_FOUND") {
        return res.status(404).json({ error: "Author not found" });
    }

    return res.json({ data: result });
}

export async function PatchBook(req: Request, res: Response) {
    const id = getNumber(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: "Id is not a number" });
    }

    const data: UpdateBook = {};

    if (req.body.title !== undefined) {
        data.title = req.body.title;
    }

    if (req.body.year !== undefined) {
        data.year = Number(req.body.year);
    }

    if (req.body.author_id !== undefined) {
        data.author_id = Number(req.body.author_id);
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    if (data.title !== undefined && (typeof data.title !== "string" || data.title.trim().length < 1 || data.title.length > 200)) {
        return res.status(400).json({ error: "Invalid title" });
    }

    if (data.year !== undefined && (!Number.isInteger(data.year) || data.year < 1000 || data.year > 2100)) {
        return res.status(400).json({ error: "Invalid year" });
    }

    if (data.author_id !== undefined && (!Number.isInteger(data.author_id) || data.author_id < 1)) {
        return res.status(400).json({ error: "Invalid author_id" });
    }

    const result = await updateBook(id, data);

    if (result === "BOOK_NOT_FOUND") {
        return res.status(404).json({ error: "Book not found" });
    }

    if (result === "AUTHOR_NOT_FOUND") {
        return res.status(404).json({ error: "Author not found" });
    }

    return res.json({ data: result });
}
