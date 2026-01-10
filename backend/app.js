const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")


dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(require("./routes/routes"))
app.use("/", require("./routes/routes"))



// app.get("/home", (req, res) => {
//   res.status(200).json({ status: "OK", message: "Server is running" })
// })





const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})