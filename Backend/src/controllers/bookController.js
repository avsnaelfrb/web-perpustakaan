import prisma from "../config/prismaConfig.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createBook = catchAsync(async (req, res, next) => {
  const {
    title,
    author,
    description,
    type,      // BOOK | JOURNAL | ARTICLE (string)
    genreId,
    stock,
    year,
    category,  // "PHYSICAL" | "DIGITAL"
  } = req.body;

  if (!title || !author || !type || !genreId || !year) {
    return next(new AppError("Field wajib belum lengkap.", 400));
  }

  const parsedGenreId = Number(genreId);
  const parsedYear = Number(year);

  if (!Number.isInteger(parsedGenreId) || parsedGenreId <= 0) {
    return next(new AppError("Genre ID tidak valid.", 400));
  }

  if (!Number.isInteger(parsedYear) || parsedYear < 1000) {
    return next(new AppError("Tahun terbit tidak valid.", 400));
  }

  let bookCategory;
  if (category === "DIGITAL") {
    bookCategory = "DIGITAL";
  } else {
    bookCategory = "PHYSICAL";
  }

  const coverFile = req.files?.cover?.[0] || null;
  const bookFile = req.files?.bookFile?.[0] || null;

  const coverPath = coverFile ? `/uploads/covers/${coverFile.filename}` : null;
  const bookFilePath = bookFile ? `/uploads/books/${bookFile.filename}` : null;
  const bookFileSize = bookFile ? bookFile.size : null;

  if (bookCategory === "DIGITAL" && !bookFilePath) {
    return next(new AppError("Buku digital wajib menyertakan file PDF!", 400));
  }

  const parsedStock = stock !== undefined && stock !== null && stock !== "" 
    ? Number(stock)
    : 1;

  if (Number.isNaN(parsedStock) || parsedStock < 0) {
    return next(new AppError("Stok harus berupa angka >= 0", 400));
  }

  const finalStock = bookCategory === "PHYSICAL" ? parsedStock : 0;

  const newBook = await prisma.book.create({
    data: {
      title,
      author,
      description,
      type,
      genreId: parsedGenreId,
      yearOfRelease: parsedYear,

      category: bookCategory,
      stock: finalStock,

      cover: coverPath,
      fileUrl: bookFilePath,
      fileSize: bookFileSize,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Berhasil menambahkan data",
    data: newBook,
  });
});

export const getAllBook = catchAsync(async (req, res, next) => {
  const { genreId, type, search } = req.query;

  let filters = {};

  if (genreId) {
    filters.genreId = genreId;
  }
  if (type) {
    filters.type = type;
  }
  if (search) {
    filters.OR = [
      { title: { contains: search } },
      { author: { contains: search } },
      { description: { contains: search } },
    ];
  }
  const books = await prisma.book.findMany({
    where: filters,
    include: { genre: true },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil data semua buku",
    data: books,
  });
});

export const getBookById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (!book) {
    return next(new AppError(`Buku dengan ${id} tidak ditemukan`, 404));
  }

  res.status(200).json({
    status: "success",
    message: `Berhasil mengambil data buku dengan id ${id}`,
    data: book,
  });
});

export const UpdateBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, author, description, type, genreId, stock, year } = req.body;

  const bookExist = await prisma.book.findUnique({
    where: { id },
  });

  if (!bookExist) {
    return next(new AppError("Buku tidak ditemukan", 404));
  }

  const dataToUpdate = {
    title,
    author,
    description,
    type,
    genreId : genreId ? Number(genreId) : undefined,
    stock : stock ? Number(stock) : undefined,
    yearOfRelease: year ? Number(year) : undefined,
  };

  if (req.file) {
    dataToUpdate.cover = `/uploads/covers/${req.file.filename}`;
  }

  const updatedBook = await prisma.book.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });

  res.status(200).json({
    status: "success",
    message: `Berhasil mengupdate buku dengan id ${id}`,
    data: updatedBook,
  });
});

export const deleteBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await prisma.book.findUnique({
    where: { id: id },
  });
  if (!book) {
    return next(new AppError(`Buku dengan id ${id}, tidak ditemukan`, 404));
  }

  const delBook = await prisma.book.delete({
    where: { id: Number(id) },
  });
  res.status(200).json({
    status: "success",
    message: `Berhasil menghapus data buku dengan id ${id}`,
    data: delBook,
  });
});
