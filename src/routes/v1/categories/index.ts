import express, { Router } from "express";
import { createCategory, listCategories } from "./controller";

const categories: Router = express.Router();

categories.get("/", listCategories);
categories.post("/", createCategory);

export default categories;