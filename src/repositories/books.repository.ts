import { Op } from "sequelize";
import { Book as BookModel } from "../models/index.ts";
import { Book } from "../types/book.ts";
import { promises } from "dns";

export async function BookFindById (id:number):Promise<Book | null> {
    const resBook = await BookModel.findByPk(id);
    return resBook;                                 
}

export async function BookFindAll ():Promise<Book[] | null> {
    const resBooks = await BookModel.findAll({ where: { available: true } });
    return resBooks;
}
// { where: { available: true } }
// { where: { available: false } }



export async function BookCreateFormat (titleReq:string, yearReq:number, author_idReq:number){
    const newBook = await BookModel.create({ title: titleReq, year: yearReq, author_id: author_idReq });    
    return (newBook);
}