import prisma from "../config/prismaConfig.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, nim } = req.body;

  const existUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existUser) {
    return next(new AppError("Email sudah terdaftar", 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      nim,
      role: "USER",
    },
  });

  newUser.password = undefined;

  res.status(201).json({
    status: "succes",
    message: "Berhasil registrasi user baru",
    data: newUser,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Email atau password salah", 401));
  }

  const payload = { id: user.id, role: user.role };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });

  res.status(200).json({
    status: "succes",
    message: "berhasil login",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});
