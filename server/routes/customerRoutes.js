// customerRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import Customer from '../models/Customer.js';  // Changed to import syntax
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = new Customer({ name, email, password: hashedPassword });
    await customer.save();

    res.status(201).json({ message: 'Registration successful', customer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', customer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if email exists
router.post('/check', async (req, res) => {
  const { email } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      res.status(200).json({ exists: true, customer: existingCustomer });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;  // Changed to export default
