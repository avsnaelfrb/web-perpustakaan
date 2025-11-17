import express from "express"
import { createGenre, deleteGenre, getAll, getById, updateGenre } from "../controllers/genreController.js"
import { verifyToken, isAdmin } from "../middleware/middleware.js"

const route = express.Router()

route.post("/", verifyToken, isAdmin, createGenre)
route.get("/", verifyToken, isAdmin, getAll)
route.get("/:id", verifyToken, isAdmin, getById)
route.put("/:id", verifyToken, isAdmin, updateGenre)
route.delete("/:id", verifyToken, isAdmin, deleteGenre)

export default route