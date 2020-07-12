const express = require("express")
const mongoose = require("mongoose")
const auth = require("./api/middlewares/auth.middleware")
const cors = require("cors")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT_MAIN || 5000

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

    // app.use("/auth/users", require("./api/routes/users"))
    app.get("/test", auth, (req, res) => {
      res.json("MAin server")
    })

    app.listen(PORT, () => console.log(`Main server started at port: ${PORT}`))
  } catch (error) {
    return console.log(`Main server error: ${error.message}`)
  }
}

start()
