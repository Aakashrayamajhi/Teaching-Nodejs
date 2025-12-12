import express from "express"
import mongoose from "mongoose"
import userModel from "./model/usermodel.js"

const app = express()
const port = 3000

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})