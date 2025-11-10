import { Router } from "express";
import userRoute from "../routes/userRoute.js"

const router = Router()

router.use("/user", userRoute )

export default router