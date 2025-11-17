import express from "express";
import {
  createBook,
  deleteBook,
  getAllBook,
  getBookById,
  UpdateBook,
} from "../controllers/bookController.js";
import { verifyToken, isAdmin } from "../middleware/middleware.js";
import upload from "../config/multerConfig.js";

const route = express.Router();

route.post("/", verifyToken, isAdmin, upload.single("cover") ,createBook);
route.get("/", getAllBook);
route.get("/:id", getBookById);
route.put("/:id", verifyToken, isAdmin, upload.single("cover"), UpdateBook);
route.delete("/:id",verifyToken, isAdmin, deleteBook);

export default route;
