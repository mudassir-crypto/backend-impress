import express from 'express'
import { body, param } from 'express-validator'
import { login, protectedRoute, register } from '../controllers/userControllers.js'
import { isLoggedIn } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/register')
  .post([
    body("email").isEmail().trim().escape(),
    body("password").trim().escape()
  ], register)

router.route('/login')
  .post([
    body("email").isEmail().trim().escape(),
    body("password").trim().escape()
  ], login)

router.route('/protected')
  .get(isLoggedIn, protectedRoute)


export default router