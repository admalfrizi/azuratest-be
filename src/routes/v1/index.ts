import express, { Router } from "express";
import books from "./books";

const v1: Router = express.Router();

v1.use("/books", books);

export default v1;