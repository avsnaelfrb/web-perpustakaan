import prisma from "../config/prismaConfig.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export default async function register(req, res){
    const { name, email, password, nim } = req.body;

    if(!name || !email || !password || !nim) {
        return res.status(400).json({ message: "harap isi seluruh field" })
    }

    try {
        const existUser = await prisma.user.findUnique({
            where : { email }
        })

        if(existUser) {
            return res.status(400).json({ message: "email sudah terdaftar" })
        }

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
    return;
} 

export const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where : { email }
        });
        const passwordMatch = await bcrypt.compare(password, user.password);
        const payload = {id: user.id, role: user.role};
        const secret = process.env.JWT_SECRET
        const token = jwt.sign(payload, secret, {expiresIn: "1d"})

        if(!user){
            return res.status(404).json({ message: "user tidak ditemukan" })
        }

        if(!passwordMatch){
            return res.status(404).json({ message: "Password salah" })
        }

        res.status(200).json({ 
            status: "succes",
            message: "berhasil login",
            data: {
                id : user.id,
                name : user.name,
                email,
                role : user.role
            },
            token 
        })
    } catch (error) {
        res.status(500).json({
            status: "error", 
            message: error.message
        })
    }
}