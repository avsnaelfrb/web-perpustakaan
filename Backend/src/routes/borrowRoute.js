import express from "express"
import { borrowBook, getAllBorrow, returnBook } from "../controllers/borrowController.js"
import { isAdmin, verifyToken } from "../middleware/middleware.js"
import { borrowBookRules, returnBookRules, validate } from "../validators/borrowValidator.js"

const route = express.Router()

route.post("/:bookId", verifyToken, borrowBookRules, validate, borrowBook);
route.post("/return/:borrowId", verifyToken, returnBookRules, validate, returnBook)
route.get("/", verifyToken, isAdmin, getAllBorrow)

export default route