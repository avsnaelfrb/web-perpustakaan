import express from "express"
import { getAllReadLogs, logRead } from "../controllers/readLogController.js"

const route = express.Router()

route.post("/", logRead)
route.get("/", getAllReadLogs)

export default route