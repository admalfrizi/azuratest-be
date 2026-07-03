import express, { Router } from "express";
import { listBooks, getBook } from "./controller";

const books: Router = express.Router();

books.get("/", listBooks);
books.get("/:id", getBook);

export default books;