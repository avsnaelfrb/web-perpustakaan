import prisma from "../config/prismaConfig.js";
import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"

export default async function register(req, res){
    const { name, email, password, nim } = req.body;

    if(!name || !email || !password || !nim) {
        return res.status(400).json({ message: "harap isi seluruh field" })
    }

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await prisma.user.create({
            data : {
                name,
                email,
                password: hashedPassword,
                nim,
            }
        }) 
        res.status(200).json({
            message: "Berhasil menambahkan user!",
            data : { newUser },
            status : "succes"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status : "error"
        })
    }
} 