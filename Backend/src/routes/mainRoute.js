import { Router } from "express";
import userRoute from "../routes/userRoute.js"
import bookRoute from "../routes/bookRoute.js"
import genreRoute from "../routes/genreRoute.js"

const router = Router()

router.use( "/user", userRoute )
router.use("/book", bookRoute )
router.use("/genre", genreRoute )

export default router