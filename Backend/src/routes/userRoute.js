import express from "express"
import { register, login } from "../controllers/userController.js"
import { loginRules, registerRules, validate } from "../validators/userValidator.js"

const router = express.Router()

router.post("/register", registerRules, validate, register)
router.post("/login", loginRules, validate, login)

export default router