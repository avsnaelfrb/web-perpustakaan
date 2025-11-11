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
    res.status(500).json({ message: error.message, status: "error" })
  }
};

export const getAllBook = async (req, res) => {
    try {
        const allBook = await prisma.book.findMany()
        res.status(200).json({
            message: "berhasil mengambil semua data",
            data: allBook,
            status: "succes"
        })
    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" })
    }
}