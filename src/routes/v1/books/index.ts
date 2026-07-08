import express, { Router } from "express";
import { listBooks, getBook, createBook, updateBook } from "./controller";

const books: Router = express.Router();

books.get("/", listBooks);
books.get("/:id", getBook);
books.post("/", createBook);
books.put("/:id", updateBook);

export default books;