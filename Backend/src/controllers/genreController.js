import prisma from "../config/prismaConfig.js";

export const createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    !name && res.status(401).json({ message: "nama genre harus diisi" });

    const existGenre = await prisma.genre.findUnique({
      where: { name },
    });
    existGenre && res.status(401).json({ message: "genre sudah ada" });

    const newGenre = await prisma.genre.create({
      data: { name },
    });
    res.status(200).json({
      status: "success",
      message: "genre berhasil ditambahkan",
      data: newGenre,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const getAll = await prisma.genre.findMany({
      include: { books: true },
      orderBy: { name: "asc" },
    });
    res.status(200).json({
      status: "succes",
      message: "berhasil mengambil semua genre",
      data: getAll,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const genreId = await prisma.genre.findUnique({
      where: { id: Number(id) },
      include: { books: true }
    });
    res.status(200).json({
      status: "success",
      message: "berhasil mengambil data genre",
      data: genreId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGenre = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;

    const delGenre = await prisma.genre.delete({
      where: { id: Number(id) },
    });
    !delGenre && res.status(404).json({ message: "Genre tidak ditemukan." });

    res.status(200).json({
      status: "succes",
      message: "berhasil menghapus genre",
      data: delGenre,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
