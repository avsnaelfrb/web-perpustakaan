import express from "express"
import { createBook, getAllBook } from "../controllers/bookController.js"

const route = express.Router()

route.post("/", createBook)
route.get("/", getAllBook)

export default route