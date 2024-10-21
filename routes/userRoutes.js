// routes/authRoutes.js
const express = require('express');
const sdk = require('node-appwrite');
const authMiddleware = require('../middleware/authMiddleware');

const authRoutes = (client) => {
    const router = express.Router();
    console.log(client);
    const users = new sdk.Account(client);

    // User Signup
    router.post('/signup', async (req, res) => {
        const { email, password, name } = req.body;
        try {
            const user = await users.create('unique()', email, password, name);
            res.send({ message: 'User created successfully', user });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    // User Login
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const session = await users.createEmailPasswordSession(email, password);
            res.send({ message: 'Logged in successfully', session });
        } catch (error) {
            res.status(401).send({ error: 'Invalid credentials' });
        }
    });

    // User Logout
    router.post('/logout', authMiddleware, async (req, res) => {
        const userId = req.userId;
        try {
            await users.deleteSession(userId, 'current');
            res.send({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    // Get User Details
    router.get('/me', authMiddleware, async (req, res) => {
        const userId = req.userId;
        try {
            const user = await users.get(userId);
            res.send(user);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    return router;
};

module.exports = authRoutes;
