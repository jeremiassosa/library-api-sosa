import type { Response } from "express";
import * as BooksRepository from "../repositories/books.repository.ts";
import { UpdateBook } from "../types/book.ts";


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


export async function remove(id: number): Promise<"DELETED" | "BOOK_NOT_FOUND" > {
  const book = await BooksRepository.BookFindById(id);
  if (!book) return "BOOK_NOT_FOUND";

  await BooksRepository.BookDelete(id);
  
  return "DELETED";
}

export async function updateBook(id:number, data:UpdateBook) {
    const book = await BooksRepository.BookUpdate(id, data);
    return book;
}