import express from 'express'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors'

const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))
app.use(cors())

//routes
app.use('/api/v1', userRoutes)
app.use('/api/v1', productRoutes)

app.get('/', (req, res) => {
  res.send("API is working")
})

// error Middlewares
app.use(notFound)
app.use(errorHandler)

export default app