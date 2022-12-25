import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true 
  }, 
  category: {
    type: String,
    required: true
  },
  images: [
    {
      id: String,
      secure_url: String,
      color: String
    }
  ]
})

export default mongoose.model("Product", productSchema)