const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT_AUTH || 4000

const start = async () => {
  try {
    mongoose.connect(
      process.env.ATLAS_URI,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      () => console.log("MongoDB started successfully!")
    )

    app.use("/auth", require("./api/routes/users"))

    app.listen(PORT, () => console.log(`Auth server started at port: ${PORT}`))
  } catch (error) {
    return console.log(`Auth server error: ${error.message}`)
  }
}

start()
