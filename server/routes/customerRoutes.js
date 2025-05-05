import express from 'express';
import { Customer } from '../models/customer.js';
import bcrypt from 'bcryptjs'; // For password hashing

const router = express.Router();

// Route for user registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;  // Fixing 'username' to 'name'

  try {
    // Check if the user already exists
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer (corrected model name from 'User' to 'Customer')
    const newUser = new Customer({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new customer
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', customer: newUser });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// Route for login (added missing login route)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', customer: user });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
