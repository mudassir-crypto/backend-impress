import User from '../models/user.js'
import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].param}: ${errors.array()[0].msg}`)
  }

  const { email, password } = req.body
  
  const user = await User.create({
    email, password
  })
  const token = user.getJwtToken()
  
  user.password = undefined

  res.status(200).json({
    user,
    token
  })
})  

export const login = asyncHandler(async (req, res) => {
  
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].param}: ${errors.array()[0].msg}`)
  }
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if(!user){
    throw new Error("You are not authorized")
  }

  if(user && await user.matchPassword(password)){
    const token = user.getJwtToken()
    user.password = undefined
    
    res.status(200).json({
      _id: user._id,
      token
    })
  } else {
    throw new Error("Email or Password is invalid")
  }

})

export const protectedRoute = asyncHandler(async (req, res) => {
  const user = req.user
  res.status(200).json({
    success: true,
    user
  })
})