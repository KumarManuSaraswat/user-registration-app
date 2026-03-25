const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (Replace with your actual MongoDB URI if using Atlas)
mongoose.connect('mongodb://127.0.0.1:27017/user_registration_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Registration Endpoint
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 2. Hash the password (Task 4 requirement)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));