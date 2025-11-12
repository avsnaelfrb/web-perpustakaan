import prisma from "../config/prismaConfig.js";

export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const { userId } = req.user.id;

    const book = await prisma.book.findUnique({
      where: { id: Number(bookId) },
    });
    if (!book) {
      return res.status(401).json({ message: "buku tidak ditemukan" });
    }
    if (book.stock <= 0) {
      return res.status(402).json({ message: "stock buku habis" });
    }

    await prisma.book.update({
      where: { id: Number(bookId) },
      data: { stock: { decrement: 1 } },
    });

    await prisma.borrow.update({
      where: { id: Number(borrow.id) },
      data: { status: "BORROWED" },
    });

    const borrow = await prisma.borrow.create({
      data: {
        userId,
        bookId,
        borrowDate: new Date(),
      },
    });

    res.status(200).json({
      status: "succes",
      message: "berhasil meminjam buku",
      data: borrow,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    const borrow = await prisma.borrow.findUnique({
      where: { id: Number(borrowId) },
    });
    if (!borrow) {
      return res
        .status(401)
        .json({ message: "data peminjaman tidak ditemukan" });
    }

    await prisma.borrow.update({
      where: { id: Number(borrowId) },
      data: { status: "RETURNED" },
    });

    await prisma.book.update({
      where: { id: borrow.bookId },
      data: { stock: { increment: 1 } },
    });

    res.status(200).json({ message: "Buku berhasil dikembalikan." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBorrow = async (req, res) => {
  try {
    const borrows = await prisma.borrow.findMany({
      include: {
        user: { select: { name: true, email: true } },
        book: { select: { title: true } },
      },
      orderBy : { borrowDate: "desc" }
    });
    res
      .status(200)
      .json({
        status: "success",
        message: "berhasil mengambil semua data pinjaman buku",
        data: borrows,
      });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message })
  }
};
