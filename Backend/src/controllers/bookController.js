import prisma from "../config/prismaConfig.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createBook = catchAsync(async (req, res, next) => {
  const { title, author, description, type, genreId, stock, year } = req.body;

  if (!title || !author || !type || !genreId || !year) {
    return next(new AppError("field wajib diisi", 400));
  }

  const cover = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;
  if (!cover) {
    return next(new AppError("cover harus diisi", 400));
  }

  const newBook = await prisma.book.create({
    data: {
      title,
      author,
      description,
      cover,
      type,
      yearOfRelease: Number(year),
      genreId: Number(genreId),
      stock: stock ? Number(stock) : 1,
    },
  });

  res.status(201).json({
    status: "succes",
    message: "berhasil menambahkan data",
    data: newBook
  });
});

export const getAllBook = catchAsync(async (req, res, next) => {
  const { genreId, type, search } = req.query;

  let filters = {};

  if (genreId) {
    filters.genreId = Number(genreId);
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
    data: books
  });
});

export const getBookById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
  });

  if (!book) {
    return next(new AppError(`Buku dengan ${id} tidak ditemukan`, 404));
  }

  res.status(200).json({
    status: "succes",
    message: `Berhasil mengambil data buku dengan id ${id}`,
    data: book
  });
});

export const UpdateBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, author, description, type, genreId, stock } = req.body;

  const book = await prisma.book.findUnique({
    where: {
      id: Number(id),
    },
  });

  const cover = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;

  if (!book) {
    return next(new AppError("Buku tidak ditemukan", 404));
  }
  const updatedBook = await prisma.book.update({
    where: { id: Number(id) },
    data: {
      title,
      author,
      description,
      type,
      genreId: Number(genreId),
      stock: stock ? Number(stock) : 1,
      cover,
    },
  });
  res.status(200).json({
    status: "succes",
    message: `Berhasil mengupdate buku dengan id ${id}`,
    data: updatedBook
  });
});

export const deleteBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const delBook = await prisma.book.delete({
    where: { id: Number(id) },
  });
  res.status(200).json({
    status: "succes",
    message: `Berhasil menghapus data buku dengan id ${id}`,
    data: delBook
  });
});
