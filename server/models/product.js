import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  
  name: String,
  price: Number,
  quantity: Number,
  description: String,
  photoUrl: String,
  createdAt: String,
  specificFields: [String],
  material: String
});

export const Product = mongoose.model('Product', productSchema);
