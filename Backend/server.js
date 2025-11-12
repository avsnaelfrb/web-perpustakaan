import "dotenv/config"
import express from "express"
import mainRoute from "./src/routes/mainRoute.js"
import cors from "cors"

const corsOp = {
    origin : process.env.CORS_ALLOW.split(","),
    optionsSuccessStatus : 200
}
const app = express()
const port = process.env.PORT

app.use(cors(corsOp))
app.use(express.json())
app.use(express.static('public'))
app.use("/api", mainRoute)

app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`)
});
