import * as BooksRepository from "../repositories/books.repository.js";
import { BookFilters, NewBook, UpdateBook } from "../types/book.js";
import { Page, Pagination } from "../types/common.js";
import { Book } from "../types/book.js";

export async function getById(bookId: number): Promise<Book | null> {
    return await BooksRepository.BookFindById(bookId);
}

export async function getAll(filters: BookFilters, pagination: Pagination): Promise<Page<Book>> {
    return await BooksRepository.search(filters, pagination);
}

export async function createBook(data: NewBook): Promise<Book | "AUTHOR_NOT_FOUND"> {
    const authorExists = await BooksRepository.AuthorExists(data.author_id);

    if (!authorExists) {
        return "AUTHOR_NOT_FOUND";
    }

    return await BooksRepository.BookCreateFormat(data);
}

export async function remove(id: number): Promise<"DELETED" | "BOOK_NOT_FOUND" | "BOOK_HAS_LOANS"> {
    const book = await BooksRepository.BookFindById(id);

    if (!book) {
        return "BOOK_NOT_FOUND";
    }

    const hasLoans = await BooksRepository.BookHasLoans(id);

    if (hasLoans) {
        return "BOOK_HAS_LOANS";
    }

    await BooksRepository.BookDelete(id);
    return "DELETED";
}

export async function updateBook(id: number, data: UpdateBook): Promise<Book | "BOOK_NOT_FOUND" | "AUTHOR_NOT_FOUND"> {
    const book = await BooksRepository.BookFindById(id);

    if (!book) {
        return "BOOK_NOT_FOUND";
    }

    if (data.author_id !== undefined) {
        const authorExists = await BooksRepository.AuthorExists(data.author_id);

        if (!authorExists) {
            return "AUTHOR_NOT_FOUND";
        }
    }

    return await BooksRepository.BookUpdate(id, data) as Book;
}
