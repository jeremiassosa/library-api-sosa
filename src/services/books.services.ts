import type { Response } from "express";
import * as BooksRepository from "../repositories/books.repository.ts";


export async function getById(bookId: number, res: Response ) {
    if (Number.isNaN(bookId)) {
        res.status(400).json({ "error": "ID is not a number" })
        return;
    }

  return await BooksRepository.BookFindById(bookId);
}

export async function getAll() {
  return await BooksRepository.BookFindAll();
}

export async function createBook(titleReq:string, yearReq:number, author_idReq:number){
    const newBook = await BooksRepository.BookCreateFormat(titleReq, yearReq, author_idReq);
    return newBook;
}
