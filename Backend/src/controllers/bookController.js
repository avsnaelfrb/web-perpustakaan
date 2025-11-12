import prisma from "../config/prismaConfig.js";

export const createBook = async (req, res) => {
  const { title, author, description, coverUrl, type, genreId, stock } =
    req.body;

  try {
    if (!title || !author || !type || !genreId) {
      return res.status(401).json({ message: "field wajib diisi" });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        description,
        coverUrl,
        type,
        genreId: Number(genreId),
        stock: stock ? Number(stock) : 1,
      },
    });
    res.status(200).json({
      message: "berhasil menambahkan data",
      data: newBook,
      status: "succes",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

export const getAllBook = async (req, res) => {
  try {
    const { genreId, type, search } = req.query;

    const filters = {};

    if (genreId) filters.genreId = Number(genreId);
    if (type) filters.type = type;
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const books = await prisma.book.findMany({
      where: filters,
      include: { genre: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data buku." });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json({
      message: `berhasil mengambil data buku dengan id ${id}`,
      data: book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UpdateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, description, coverUrl, type, genreId, stock } =
    req.body;

  try {
    const book = await prisma.book.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!book) {
      return res.status(400).json({
        message: "Buku tidak ditemukan",
        status: "error",
      });
    }
    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        description,
        coverUrl,
        type,
        genreId: Number(genreId),
        stock: stock ? Number(stock) : 1,
      },
    });
    res.status(200).json({
      message: `berhasil mengupdate buku dengan id ${id}`,
      data: updatedBook,
      status: "succes",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const delBook = await prisma.book.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({
      message: `berhasil menghapus data buku dengan id ${id}`,
      data: delBook,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
