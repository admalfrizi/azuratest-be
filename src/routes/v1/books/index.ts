import express, { Router } from "express";
import { listBooks, getBook, createBook } from "./controller";

const books: Router = express.Router();

books.get("/", listBooks);
books.get("/:id", getBook);
books.post("/", createBook);

export default books;