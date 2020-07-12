const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next()
    }

    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json("Access forbidden!")
    }

    const token = auth.split(" ")[1]

    if (!token) {
      return res.status(401).json("Access forbidden!")
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.json({
          message: "Access temporary forbidden!",
          statusAccess: false,
        })
      req.userId = user.userId
      next()
    })
  } catch (error) {
    res.status(401).json(`Forbidden auth, error: ${error.message}`)
  }
}
