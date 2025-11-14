import express from "express"
import { getAllReadLogs, logRead } from "../controllers/readLogController.js"
import { verifyToken } from "../middleware/middleware.js"

const route = express.Router()

route.post("/reading/:bookId", verifyToken, logRead)
route.get("/", getAllReadLogs)

export default route