import express from "express"
import { borrowBook, getAllBorrow, returnBook } from "../controllers/borrowController.js"
import { isAdmin, verifyToken } from "../middleware/middleware.js"

const route = express.Router()

route.post("/:bookId",verifyToken, borrowBook)
route.post("/return/:borrowId", verifyToken, returnBook)
route.get("/", verifyToken, isAdmin, getAllBorrow)

export default route