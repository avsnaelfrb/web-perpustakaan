import express from "express"
import { borrowBook, getAllBorrow, returnBook } from "../controllers/borrowController.js"
import { verifyToken } from "../middleware/middleware.js"

const route = express.Router()

route.post("/:bookId",verifyToken, borrowBook)
route.post("/return/:borrowId", returnBook)
route.get("/", getAllBorrow)

export default route