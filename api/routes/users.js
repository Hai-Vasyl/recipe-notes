const { Router } = require("express")
const User = require("../models/User")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = Router()

function getToken(id, secret, expiresIn = null) {
  return jwt.sign({ userId: id }, secret, expiresIn && { expiresIn })
}

router.post(
  "/register",
  [
    check(
      "username",
      "Username must contain at least 4 - 15 characters!"
    ).isLength({
      min: 4,
      max: 15,
    }),
    check("email", "Email is not correct!").isEmail(),
    check("password", "Password must contain at least 4 characters!").isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json(errors)

      const { username, email, password, typeUser } = req.body

      const userByUsername = await User.findOne({ username })
      if (userByUsername)
        return res.status(400).json({
          errors: [
            {
              param: "username",
              msg: "User with the same username already exists!",
            },
          ],
        })
      const userByEmail = await User.findOne({ email })
      if (userByEmail)
        return res.status(400).json({
          errors: [
            {
              param: "email",
              msg: "User with the same email already exists!",
            },
          ],
        })

      const hashedPassword = await bcrypt.hash(password, 12)

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        typeUser,
        date: new Date(),
      })

      const user = await newUser.save()

      const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env
      const accessToken = getToken(user._id, ACCESS_TOKEN_SECRET, "1m")
      const refreshToken = getToken(user._id, REFRESH_TOKEN_SECRET)

      await User.updateOne({ _id: user._id }, { refresh_token: refreshToken })
      res.status(201).json({ accessToken, refreshToken, user })
    } catch (error) {
      res.status(500).json(`Register error: ${error.message}`)
    }
  }
)

router.post(
  "/login",
  [
    check("email", "Email is not correct!").isEmail(),
    check("password", "Password is not correct!").isLength({ min: 4 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json(errors)

      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user)
        return res.status(400).json({
          errors: [
            {
              param: "email",
              msg: "User with this email is not exists!",
            },
          ],
        })

      const comparedPassword = await bcrypt.compare(password, user.password)
      if (!comparedPassword) {
        return res.status(400).json({
          errors: [
            {
              param: "password",
              msg: "Password is not correct!",
            },
          ],
        })
      }

      const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env
      const accessToken = getToken(user._id, ACCESS_TOKEN_SECRET, "15m")
      const refreshToken = getToken(user._id, REFRESH_TOKEN_SECRET)

      await User.updateOne({ _id: user._id }, { refresh_token: refreshToken })
      res.status(201).json({ accessToken, refreshToken, user })
    } catch (error) {
      res.status(500).json(`Login error: ${error.message}`)
    }
  }
)

router.post("/token", async (req, res) => {
  try {
    const { refreshToken, userId } = req.body
    const user = await User.findOne({
      _id: userId,
      refresh_token: refreshToken,
    })

    if (!user) {
      return res.status(401).json("User access denied!")
    }

    const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env
    jwt.verify(user.refresh_token, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).json("User access denied!")

      const accessToken = getToken(user.userId, ACCESS_TOKEN_SECRET, "2m")
      res.json({ accessToken })
    })
  } catch (error) {
    res.status(500).json(`Token getting error: ${error.message}`)
  }
})

router.delete("/logout", async (req, res) => {
  try {
    const { refreshToken, userId } = req.body

    await User.updateOne(
      {
        _id: userId,
        refresh_token: refreshToken,
      },
      { refresh_token: "" }
    )

    res.status(203).json("User successfully logout!")
  } catch (error) {
    res.status(500).json(`Logout error: ${error.message}`)
  }
})

module.exports = router
