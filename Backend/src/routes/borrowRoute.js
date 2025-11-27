import express from "express"
import { borrowBook, getAllBorrow, returnBook, getMyBorrowHistory } from "../controllers/borrowController.js"
import { isAdmin, verifyToken } from "../middleware/middleware.js"
import { borrowBookRules, returnBookRules, validate } from "../validators/borrowValidator.js"

const route = express.Router()

route.post("/:bookId", verifyToken, borrowBookRules, validate, borrowBook);
route.post("/return/:borrowId", verifyToken, isAdmin, returnBookRules, validate, returnBook)
route.get("/", verifyToken, isAdmin, getAllBorrow)
route.get("/userBorrow", verifyToken, getMyBorrowHistory);

export default route