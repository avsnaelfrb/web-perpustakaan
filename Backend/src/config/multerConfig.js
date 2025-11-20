import multer from "multer"
import path from "path"

const storage = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, "public/uploads/covers")
    },
    filename : (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "cover-" + unique + ext)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png"
    ) {
        cb(null, true)
    } else {
        cb(new Error("Hanya file .jpeg  dan .png yang diizinkan"))
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fieldSize: 1024 * 1024 * 5,
    }
});

export default upload;