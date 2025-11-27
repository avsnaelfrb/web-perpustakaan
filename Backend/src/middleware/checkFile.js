import AppError from "../utils/appError.js";

export const handleFilePath = (req, res, next) => {
  req.body.coverPath = null;
  req.body.bookFilePath = null;
  req.body.photoProfilePath = null;
  req.body.bookFileSize = null;

  if (req.files) {
    if (req.files['coverBook']?.[0]) {
      req.body.coverPath = `/uploads/covers/${req.files['coverBook'][0].filename}`;
    }

    if (req.files['bookFile']?.[0]) {
      req.body.bookFilePath = `/uploads/books/${req.files['bookFile'][0].filename}`;
      req.body.bookFileSize = req.files['bookFile'][0].size;
    }
    
    if (req.files['photoProfile']?.[0]) {
      req.body.photoProfilePath = `/uploads/profiles/${req.files['photoProfile'][0].filename}`;
    }
  }

  if (req.file) {
    if (req.file.fieldname === 'photoProfile') {
      req.body.photoProfilePath = `/uploads/profiles/${req.file.filename}`;
    }
    if (req.file.fieldname === 'cover') {
       req.body.coverPath = `/uploads/covers/${req.file.filename}`;
    }
  }

  next();
};
