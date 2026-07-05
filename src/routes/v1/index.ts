import express, { Router } from "express";
import books from "./books";
import categories from "./categories";

const v1: Router = express.Router();

v1.use("/books", books);
v1.use("/categories", categories);

export default v1;