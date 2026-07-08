import express, { Router } from "express";
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from "./controller";

const categories: Router = express.Router();

categories.get("/", listCategories);
categories.get("/:id", getCategory);
categories.post("/", createCategory);
categories.put("/:id", updateCategory);
categories.delete("/:id", deleteCategory)

export default categories;