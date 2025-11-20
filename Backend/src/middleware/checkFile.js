import AppError from "../utils/appError.js";

export const checkCover = (req, res, next) => {
  if (req.file) {
    req.body.filePath = `/uploads/covers/${req.file.filename}`;
  } else {
    req.body.filePath = null;
  }
  next();
};
