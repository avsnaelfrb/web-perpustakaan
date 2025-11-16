import prisma from "../config/prismaConfig.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const logRead = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  const book = await prisma.book.findUnique({
    where: { id: Number(bookId) },
  });
  if (!book) {
    return next(new AppError("Buku tidak ditemukan", 404));
  }
  const read = await prisma.readLog.create({
    data: { userId, bookId: Number(bookId), readAt: new Date() },
  });

  res.status(200).json({ message: "Aktivitas membaca tercatat.", data: read });
});

export const getAllReadLogs = catchAsync(async (req, res, next) => {
  const logs = await prisma.readLog.findMany({
    include: {
      user: { select: { name: true, email: true } },
      book: { select: { title: true, type: true } },
    },
    orderBy: { readAt: "desc" },
  });
  res.json(logs);
});
