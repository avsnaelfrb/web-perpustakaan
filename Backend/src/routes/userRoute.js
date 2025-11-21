import express from "express";
import {
  register,
  login,
  editPhotoProfile,
} from "../controllers/userController.js";
import {
  loginRules,
  paramRule,
  registerRules,
  validate,
} from "../validators/userValidator.js";
import upload from "../config/multerConfig.js";
import { checkCover } from "../middleware/checkFile.js";

const router = express.Router();

router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.put(
  "/photo-profile/:id",
  paramRule,
  upload.single("photoProfile"),
  validate,
  checkCover,
  editPhotoProfile
);

export default router;
