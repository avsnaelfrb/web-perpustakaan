import prisma from "../config/prismaConfig.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const borrowBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    return next(new AppError("Buku tidak ditemukan", 404));
  }

  if (book.stock <= 0) {
    return next(new AppError("Stock buku habis", 400));
  }

  const existingBorrow = await prisma.borrow.findFirst({
    where: {
      userId: userId,
      bookId: bookId,
      status: "BORROWED"
    }
  });

  if (existingBorrow) {
    return next(new AppError('Anda sedang meminjam buku ini. Harap kembalikan terlebih dahulu', 400))
  }

  const activeBorrowCount = await prisma.borrow.count({
    where: {
      userId: userId,
      status: "BORROWED"
    }
  })

  if (activeBorrowCount >= 3) {
    return next(new AppError('Anda telah mencapai batas peminjaman (maksimal 3 buku)', 400))
  }



  res.status(200).json({
    status: "success",
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

export const getAllBorrow = catchAsync( async (req, res) => {
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
