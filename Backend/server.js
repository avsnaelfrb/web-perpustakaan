import "dotenv/config"
import express from "express"
import mainRoute from "./src/routes/mainRoute.js"

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.static('public'))
app.use("/api", mainRoute)

app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`)
});
