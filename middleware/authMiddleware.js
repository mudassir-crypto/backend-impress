import User from "../models/user.js"
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : undefined

  if(!token){
    throw new Error("Login first to access this page")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  req.user = await User.findById(decoded.id)
  next()
})