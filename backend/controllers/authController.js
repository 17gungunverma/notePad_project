


const User = require("../models/usermodel")
const generateToken = require("../utils/generateToken")

exports.register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res.json({ success: false, message: "All fields required" })

  if (await User.findOne({ email }))
    return res.json({ success: false, message: "User already exists" })

  const user = await User.create({ name, email, password })

  res.status(201).json({
    success: true,
    data: {
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email },
    },
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select("+password")

  if (!user || !(await user.comparePassword(password)))
    return res.json({ success: false, message: "Invalid credentials" })

  res.json({
    success: true,
      message: "Successfully logged in",
    data: {
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email },
    },
  })
}
