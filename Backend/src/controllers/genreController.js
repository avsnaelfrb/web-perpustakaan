import prisma from "../config/prismaConfig.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createGenre = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new AppError("Nama genre harus diisi", 400));
  }

  const existGenre = await prisma.genre.findUnique({
    where: { name },
  });
  if (existGenre) {
    return next(new AppError("Genre sudah ada", 400));
  }

  const newGenre = await prisma.genre.create({
    data: { name },
  });
  res.status(201).json({
    status: "success",
    message: "genre berhasil ditambahkan",
    data: newGenre,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const getAll = await prisma.genre.findMany({
    include: { books: true },
    orderBy: { name: "asc" },
  });
  res.status(200).json({
    status: "succes",
    message: "berhasil mengambil semua genre",
    data: getAll,
  });
});

export const getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const genreId = await prisma.genre.findUnique({
    where: { id: Number(id) },
    include: { books: true },
  });

  if (!genreId) {
    return next(
      new AppError(`tidak dapat menemukan genre dengan id ${id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    message: "berhasil mengambil data genre",
    data: genreId,
  });
});

export const updateGenre = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const dataToUpdate = {};

  if (name) {
    dataToUpdate.name = name;
  }

  const updatedGenre = await prisma.genre.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });
  res.status(200).json({
    status: "success",
    message: "berhasil mengupdate genre",
    data: updatedGenre,
  });
});

export const deleteGenre = catchAsync( async (req, res, next) => {
    const { id } = req.params;

    const delGenre = await prisma.genre.delete({
      where: { id: Number(id) },
    });
    if (!delGenre) {
      return next( new AppError("Genre tidak ditemukan", 404) )
    }

    res.status(200).json({
      status: "succes",
      message: "berhasil menghapus genre",
      data: delGenre,
    });
});
