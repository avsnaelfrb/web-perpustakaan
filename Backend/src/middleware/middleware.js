import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({ message: "akses ditolak, token tidak ada" })
    }

    const token = authHeader.split(" ")[1];
    if(!token) {
        res.status(402).json({ message: "token tidak valid" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN"){
        return res.status(404).json({ message: "akses hanya untuk admin" })
    }
    next();
}