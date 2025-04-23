import express from 'express';
import { Product } from '../models/product.js';

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product' });
  }
});
router.get('/', async (req, res) => {
  console.log("GET /api/products hit"); 
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
export default router;
