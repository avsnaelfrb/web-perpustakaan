import express from "express"
import { createGenre, deleteGenre, getAll, getById, updateGenre } from "../controllers/genreController.js"
// import { verifyToken, isAdmin } from "../middleware/middleware.js"

const route = express.Router()

route.post("/", createGenre)
route.get("/", getAll)
route.get("/:id", getById)
route.put("/:id", updateGenre)
route.delete("/:id", deleteGenre)