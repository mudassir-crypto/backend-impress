import asyncHandler from "express-async-handler"
import Product from "../models/product.js"
import cloudinary from 'cloudinary'
import { validationResult } from "express-validator"
import mongoose from "mongoose"

const ObjectId = mongoose.Types.ObjectId
function isValidObjectId(id){
    if(ObjectId.isValid(id)){
      if((String)(new ObjectId(id)) === id)
          return true
      return false
    }
    return false
}

// admin
export const addProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].param}: ${errors.array()[0].msg}`)
  }

  const { productId, category, color } = req.body
  
  if(!req.files){
    throw new Error("Images are required")
  }

  const product = await Product.findOne({ productId })
  if(product){
    try{
      const singleFile = req.files.photo
      let result = await cloudinary.v2.uploader.upload(singleFile.tempFilePath, {
        folder: category
      })

      product.images.push({
        id: result.public_id,
        secure_url: result.secure_url,
        color
      })

      await product.save()

      res.status(200).json({
        message: `New Image of product ${productId} is added`
      })
    } catch(error){
      throw new Error(error)
    }
  } else {
    try{
      const singleFile = req.files.photo
      let result = await cloudinary.v2.uploader.upload(singleFile.tempFilePath, {
        folder: category
      })

      const newProduct = await Product.create({
        productId,
        category,
        images: {
          id: result.public_id,
          secure_url: result.secure_url,
          color
        }
      })

      res.status(200).json({
        message: "New Product is added"
      })
    } catch(error){
      throw new Error(error)
    }
  }
})

export const getSingleProduct = asyncHandler(async (req, res) => {
  
  const productId = req.params.productId
  if(!isValidObjectId(productId)){
    throw new Error("Wrong id passed")
  }
  
  const product = await Product.findById(productId)

  if(!product){
    throw new Error("No product")
  }

  res.status(200).json({
    product
  })
})

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()

  res.status(200).json({
    products
  })
})

// admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params
  if(!isValidObjectId(productId)){
    throw new Error("Wrong id passed")
  }
  let product = await Product.findById(productId)

  if(!product){
    throw new Error("Product does not exist")
  }

  try {

    for(let idx = 0; idx < product.images.length; idx++){
      const img = product.images[idx]
      await cloudinary.v2.uploader.destroy(img.id)
    }

    await product.remove()

    res.status(201).json({
      success: true,
      message: "Product is deleted"
    })
  } catch (error) {
    throw new Error(error)
  }
})

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().limit(8)
  res.status(200).json({
    products
  })

})
