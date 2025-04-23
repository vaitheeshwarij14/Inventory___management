import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['https://localhost:8080','https://localhost'],
  allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning']
}));
// app.options('*', cors());

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api',productRoutes)
app.get('/', (req, res) => {
  res.send('API is running...');
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000,'0.0.0.0', () => console.log('Server running at http://localhost:3000'));
  })
  .catch(err => console.error('MongoDB connection error:', err));