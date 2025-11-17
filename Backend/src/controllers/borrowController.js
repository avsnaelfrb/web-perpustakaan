import prisma from "../config/prismaConfig.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const borrowBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  const book = await prisma.book.findUnique({
    where: { id: parseInt(bookId) },
  });

  if (!book) {
    return next(new AppError("Buku tidak ditemukan", 404));
  }

  if (book.stock <= 0) {
    return next(new AppError("Stock buku habis", 400));
  }

  await prisma.book.update({
    where: { id: Number(bookId) },
    data: { stock: { decrement: 1 } },
  });

  const borrow = await prisma.borrow.create({
    data: {
      userId,
      bookId: Number(bookId),
      borrowDate: new Date(),
    },
  });

  await prisma.borrow.update({
    where: { id: Number(borrow.id) },
    data: { status: "BORROWED" },
  });

  res.status(200).json({
    status: "succes",
    message: "berhasil meminjam buku",
    data: borrow,
  });
});

export const returnBook = catchAsync(async (req, res, next) => {
  const { borrowId } = req.params;

  const borrow = await prisma.borrow.findUnique({
    where: { id: Number(borrowId) },
  });
  if (!borrow) {
    return next(new AppError("Data peminjaman tidak ditemukan", 404));
  }

  await prisma.borrow.update({
    where: { id: Number(borrowId) },
    data: { status: "RETURNED" },
  });

  await prisma.book.update({
    where: { id: borrow.bookId },
    data: { stock: { increment: 1 } },
  });

  res.status(200).json({
    status: "succes",
    message: "Buku berhasil dikembalikan.",
    data: {
      id: Number(borrowId),
      userId: borrow.userId,
      bookId: borrow.bookId,
      borrowDate: borrow.borrowDate,
      status: borrow.status,
    },
  });
});

export const getAllBorrow = catchAsync(async (req, res) => {
  const borrows = await prisma.borrow.findMany({
    include: {
      user: { select: { name: true, email: true } },
      book: { select: { title: true } },
    },
    orderBy: { borrowDate: "desc" },
  });
  res.status(200).json({
    status: "success",
    message: "berhasil mengambil semua data pinjaman buku",
    data: borrows,
  });
});
