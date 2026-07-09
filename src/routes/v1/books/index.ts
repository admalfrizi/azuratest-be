import express, { Router } from "express";
import { listBooks, getBook, createBook, updateBook, deleteBook, listPublicationDates } from "./controller";

const books: Router = express.Router();

books.get("/publication-dates", listPublicationDates);
books.get("/", listBooks);
books.get("/:id", getBook);
books.post("/", createBook);
books.put("/:id", updateBook);
books.delete("/:id", deleteBook)

export default books;