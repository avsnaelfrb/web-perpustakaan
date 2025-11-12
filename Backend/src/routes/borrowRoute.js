import express from "express"
import { borrowBook, getAllBorrow, returnBook } from "../controllers/borrowController.js"

const route = express.Router()

route.post("/", borrowBook)
route.post("/return", returnBook)
route.get("/", getAllBorrow)

export default route