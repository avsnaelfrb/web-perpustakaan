import prisma from "../config/prismaConfig.js";

export const logRead = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const book = await prisma.book.findUnique({
      where: { id: Number(bookId) },
    });
    if (!book)
      return res.status(404).json({ message: "Buku tidak ditemukan." });

    const read = await prisma.readLog.create({
      data: { userId, bookId : Number(bookId), readAt: new Date() },
    });

    res
      .status(201)
      .json({ message: "Aktivitas membaca tercatat.", data: read });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllReadLogs = async (req, res) => {
  try {
    const logs = await prisma.readLog.findMany({
      include: {
        user: { select: { name: true, email: true } },
        book: { select: { title: true, type: true } },
      },
      orderBy: { readAt: "desc" },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data log." });
  }
};
