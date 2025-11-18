import AppError from "../utils/appError.js";

export const checkCover = (req, res, next) => {
  if (req.file) {
    req.body.coverPath = `/uploads/covers/${req.file.filename}`;
  } else {
    req.body.coverPath = null;
  }
  next();
};
