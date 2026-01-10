const jwt = require("jsonwebtoken")
const User = require("../models/usermodel")

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        })
      }

      next()
    } catch (error) {
      console.error(error)
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    })
  }
}



// const jwt = require("jsonwebtoken")
// const User = require("../models/usermodel")

// exports.protect = async (req, res, next) => {
//   let token

//   // Check Authorization header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       // Extract token
//       token = req.headers.authorization.split(" ")[1]

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET)

//       // Attach user to request
//       req.user = await User.findById(decoded.id).select("-password")

//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "User not found",
//         })
//       }

//       return next()
//     } catch (error) {
//       console.error(error)
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, token failed",
//       })
//     }
//   }

//   // No token
//   return res.status(401).json({
//     success: false,
//     message: "Not authorized, no token",
//   })
// }
