import prisma from "../config/prismaConfig.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import appConfig from "../config/appConfig.js";

export const borrowBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  console.log('📝 Borrow request:', { bookId, userId });

  const bookIdNum = parseInt(bookId, 10);
  
  if (isNaN(bookIdNum)) {
    return next(new AppError("ID buku tidak valid", 400));
  }

  console.log('🔍 Looking for book with ID:', bookIdNum);

  const book = await prisma.book.findUnique({
    where: { id: bookIdNum },
  });

  console.log('📚 Book found:', book ? book.title : 'NOT FOUND');
  console.log('📦 Book category:', book?.category);
  console.log('📊 Book stock:', book?.stock);

  if (!book) {
    return next(new AppError("Buku tidak ditemukan", 404));
  }

  if (book.category === "DIGITAL") {
    return next(new AppError("Buku digital tidak dapat dipinjam.", 400));
  }

  if (book.stock <= 0) {
    return next(new AppError("Stock buku habis", 400));
  }

  console.log('🔎 Checking existing borrow - Step 1: Get all borrows for user...');

  const allUserBookBorrows = await prisma.borrow.findMany({
    where: {
      userId: userId,
      bookId: bookIdNum
    }
  });

  console.log('🔎 Found borrows:', allUserBookBorrows.length);

  const existingBorrow = allUserBookBorrows.find(
    b => b.status === "REQUESTED" || b.status === "BORROWED"
  );

  console.log('🔎 Active borrow:', existingBorrow ? `Yes (${existingBorrow.status})` : 'No');

  if (existingBorrow) {
    if (existingBorrow.status === "REQUESTED") {
      return next(new AppError('Permintaan peminjaman buku ini masih menunggu konfirmasi admin', 400));
    }
    return next(new AppError('Anda sedang meminjam buku ini. Harap kembalikan terlebih dahulu', 400));
  }

  console.log('🔢 Counting active borrows...');

  const activeBorrowCount = await prisma.borrow.count({
    where: {
      userId: userId,
      status: "BORROWED"
    }
  });

  console.log('🔢 Active borrows:', activeBorrowCount);

  if (activeBorrowCount >= 3) {
    return next(new AppError('Anda telah mencapai batas peminjaman (maksimal 3 buku)', 400));
  }

  console.log('📅 Creating dates...');

  const now = new Date();
  const dueDate = new Date(now);
  
  // ⭐ FIX: Make sure appConfig is imported and has default value
  let borrowDuration = 7; // Default fallback
  try {
    borrowDuration = appConfig?.BORROW_DURATION_DAYS || 7;
  } catch (e) {
    console.log('⚠️ appConfig not found, using default 7 days');
  }
  
  dueDate.setDate(dueDate.getDate() + borrowDuration);

  console.log('📅 Date values:', {
    now: now.toISOString(),
    dueDate: dueDate.toISOString(),
    duration: borrowDuration
  });

  console.log('💾 Creating borrow in database...');
  console.log('💾 Data to insert:', {
    userId,
    bookId: bookIdNum,
    borrowDate: now,
    dueDate: dueDate,
    status: "REQUESTED"
  });

  // ⭐ ADD TRY-CATCH around the create operation
  try {
    const newBorrow = await prisma.borrow.create({
      data: {
        userId: userId,
        bookId: bookIdNum,
        borrowDate: now,
        dueDate: dueDate,
        status: "REQUESTED"
      }
    });

    console.log('✅ Borrow created successfully:', {
      id: newBorrow.id,
      status: newBorrow.status,
      borrowDate: newBorrow.borrowDate,
      dueDate: newBorrow.dueDate
    });

    return res.status(201).json({
      status: "success",
      message: "Permintaan peminjaman berhasil! Tunggu konfirmasi admin.",
      data: newBorrow,
    });
  } catch (createError) {
    console.error('❌ Prisma create error:', createError);
    console.error('❌ Error name:', createError.name);
    console.error('❌ Error message:', createError.message);
    console.error('❌ Error code:', createError.code);
    console.error('❌ Full error:', JSON.stringify(createError, null, 2));
    
    return next(new AppError(`Gagal membuat peminjaman: ${createError.message}`, 500));
  }
});


export const confirmBorrow = catchAsync(async (req, res, next) => {
  const borrowId = Number(req.params.borrowId);

  if (Number.isNaN(borrowId)) {
    return next(new AppError("ID peminjaman tidak valid", 400));
  }

  const borrow = await prisma.borrow.findUnique({
    where: { id: borrowId },
    include: { book: true },
  });

  if (!borrow) {
    return next(new AppError("Data peminjaman tidak ditemukan", 404));
  }

  if (borrow.status !== "REQUESTED") {
    return next(
      new AppError("Peminjaman ini sudah dikonfirmasi atau selesai", 400)
    );
  }

  if (borrow.book.stock <= 0) {
    return next(new AppError("Stock buku habis", 400));
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.book.update({
      where: { id: borrow.bookId },
      data: { stock: { decrement: 1 } },
    });

    const updatedBorrow = await tx.borrow.update({
      where: { id: borrowId },
      data: {
        status: "BORROWED",
        borrowDate: new Date(),
      },
    });

    return updatedBorrow;
  });

  res.status(200).json({
    status: "success",
    message: "Peminjaman berhasil dikonfirmasi",
    data: result,
  });
});


export const returnBook = catchAsync(async (req, res, next) => {
  const borrowId = Number(req.params.borrowId);

  if (Number.isNaN(borrowId)) {
    return next(new AppError("ID peminjaman tidak valid", 400));
  }

  const borrow = await prisma.borrow.findUnique({
    where: { id: borrowId },
  });

  if (!borrow) {
    return next(new AppError("Data peminjaman tidak ditemukan", 404));
  }

  if (borrow.status === "RETURNED") {
    return next(new AppError("Sudah dikembalikan", 400));
  }

  const returnDate = new Date();
  const isOverDue = returnDate > new Date(borrow.dueDate);

  let overDueMessage = "";
  if (isOverDue) {
    const diffTime = Math.abs(returnDate - new Date(borrow.dueDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    overDueMessage = `(Terlambat ${diffDays} hari!)`;
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedBorrow = await tx.borrow.update({
      where: { id: borrowId },
      data: {
        status: "RETURNED",
        returnDate: returnDate,
      },
    });

    await tx.book.update({
      where: { id: borrow.bookId },
      data: {
        stock: { increment: 1 },
      },
    });

    await tx.readLog.create({
      data: {
        userId: borrow.userId,
        bookId: borrow.bookId,
        readAt: new Date(),
      },
    });

    return updatedBorrow;
  });

  res.status(200).json({
    status: "success",
    message: `Buku berhasil dikembalikan ${overDueMessage}.`,
    data: result,
  });
});


export const getMyBorrowHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const borrows = await prisma.borrow.findMany({
    where: { userId: Number(userId) },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          description: true,
          category: true,
          stock: true,
          cover: true,
          fileUrl: true,
        },
      },
    },
    orderBy: { borrowDate: "desc" },
  });

  res.status(200).json({
    status: "success",
    data: borrows,
  });
});

export const getAllBorrow = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalCount = await prisma.borrow.count();

  const borrows = await prisma.borrow.findMany({
    include: {
      user: { select: { name: true, email: true, nim: true } },
      book: { select: { title: true } },
    },
    orderBy: { borrowDate: "desc" },
    skip,
    take: limit,
  });

  res.status(200).json({
    status: "success",
    message: "berhasil mengambil data pinjaman buku",
    meta: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
    },
    data: borrows,
  });
});