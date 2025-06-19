const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const hash= await bcrypt.hash(password, 10);
        const user = new User({ username, password: hash });
        await user.save();
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid username or password',
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
        })  ;
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }   
});

module.exports= router;