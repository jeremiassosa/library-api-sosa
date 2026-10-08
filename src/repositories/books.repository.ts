import { Op } from "sequelize";
import { Author, Book as BookModel, Loan } from "../models/index.js";
import { Book, BookFilters, NewBook, UpdateBook } from "../types/book.js";
import { Page, Pagination } from "../types/common.js";

export async function BookFindById(id: number): Promise<Book | null> {
    const row = await BookModel.findByPk(id);
    return row ? row.toJSON() as Book : null;
}

export async function search(filters: BookFilters, pagination: Pagination): Promise<Page<Book>> {
    const where: Record<string, unknown> = {};

    if (filters.title !== undefined) {
        where.title = { [Op.iLike]: `%${filters.title}%` };
    }

    if (filters.available !== undefined) {
        where.available = filters.available;
    }

    if (filters.author_id !== undefined) {
        where.author_id = filters.author_id;
    }

    const { rows, count } = await BookModel.findAndCountAll({
        where,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [["id", "ASC"]],
    });

    return {
        data: rows.map((row) => row.toJSON() as Book),
        total: count,
        page: pagination.page,
        limit: pagination.limit,
    };
}

export async function AuthorExists(id: number): Promise<boolean> {
    const author = await Author.findByPk(id);
    return author !== null;
}

export async function BookCreateFormat(data: NewBook): Promise<Book> {
    const row = await BookModel.create(data);
    return row.toJSON() as Book;
}

export async function BookDelete(id: number): Promise<number> {
    return await BookModel.destroy({ where: { id } });
}

export async function BookHasLoans(id: number): Promise<boolean> {
    const loans = await Loan.count({ where: { book_id: id } });
    return loans > 0;
}

export async function BookUpdate(id: number, data: UpdateBook): Promise<Book | null> {
    const book = await BookModel.findByPk(id);

    if (!book) {
        return null;
    }

    await book.update(data);
    return book.toJSON() as Book;
}
