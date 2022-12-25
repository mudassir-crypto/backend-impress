import express from 'express'
import { body, param } from 'express-validator'
import { addProduct, deleteProduct, getAllProducts, getFeaturedProducts, getSingleProduct } from '../controllers/productControllers.js'
import { isLoggedIn } from '../middleware/authMiddleware.js'


const router = express.Router()

router.route("/addProduct")
  .post([
    body("productId").trim().escape(),
    body("category").trim().escape(),
    body("color").trim().escape(),
  ], isLoggedIn, addProduct)

router.route('/product/:productId')
  .get([
    param("productId").trim().escape()
  ], getSingleProduct)
  .delete([
    param("productId").trim().escape()
  ], isLoggedIn, deleteProduct)

router.route('/allProducts')
  .get(getAllProducts)

router.route('/featured')
  .get(getFeaturedProducts)

export default router