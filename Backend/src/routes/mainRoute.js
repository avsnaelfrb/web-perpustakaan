import { Router } from "express";
import userRoute from "../routes/userRoute.js"
import bookRoute from "../routes/bookRoute.js"

const router = Router()

router.use( "/user", userRoute )
router.use("/book", bookRoute )

export default router