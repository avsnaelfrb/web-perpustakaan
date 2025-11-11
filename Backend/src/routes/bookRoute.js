import express from "express"
import { createBook, deleteBook, getAllBook, getBookById, UpdateBook } from "../controllers/bookController.js"
import { verifyToken, isAdmin } from "../middleware/middleware.js"

const route = express.Router()

route.post("/", createBook, verifyToken, isAdmin)
route.get("/", getAllBook)
route.get("/:id", getBookById)
route.put("/:id", UpdateBook)
route.delete("/:id", deleteBook)

export default route