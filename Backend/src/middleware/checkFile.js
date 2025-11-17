import AppError from "../utils/appError.js";

export const checkCover = (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Cover harus diisi', 400));
    }

    req.body.coverPath = `/uploads/covers/${req.file.filename}`
}