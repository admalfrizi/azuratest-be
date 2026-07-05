import express, { Router } from "express";
import { listCategories } from "./controller";

const categories: Router = express.Router();

categories.get("/", listCategories);

export default categories;