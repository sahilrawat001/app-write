// routes/todoRoutes.js
const express = require('express');
const sdk = require('node-appwrite');
const authMiddleware = require('../middleware/authMiddleware');
const appwriteConstants = require('../helperFunction/constants');
const todoRoutes = (client) => {
    const router = express.Router();
    const databases = new sdk.Databases(client); // Use the passed client object

    // Create a new Todo item
    router.post('/todos',(req,res,next)=>{
        console.log(req.body);
    next()},authMiddleware(client), async (req, res) => {
        const { title, description,userId } = req.body;
        try {
            const todo = await databases.createDocument( appwriteConstants.APPWRITE.DATABASE_ID,  appwriteConstants.APPWRITE.COLLECTIONS.TODO, 'unique()', {
                userId,
                title,
                description,
                completed: false
            });
            res.send(todo);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    // Get all Todo items for the authenticated user
    router.get('/todos', authMiddleware(client), async (req, res) => {
        const userId = req.userId;
        const query = [`userId=${userId}`];
        try {
            const todos = await databases.listDocuments(appwriteConstants.APPWRITE.DATABASE_ID,  appwriteConstants.APPWRITE.COLLECTIONS.TODO, query);
            res.send(todos.documents);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    // Update a specific Todo item
    router.put('/todos/:id', authMiddleware(client), async (req, res) => {
        const todoId = req.params.id;
        const { title, description, completed } = req.body;
        try {
            const todo = await databases.updateDocument(appwriteConstants.APPWRITE.DATABASE_ID,  appwriteConstants.APPWRITE.COLLECTIONS.TODO, todoId, {
                title,
                description,
                completed
            });
            res.send(todo);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    // Delete a specific Todo item
    router.delete('/todos/:id', authMiddleware(client), async (req, res) => {
        const todoId = req.params.id;
        try {
            await databases.deleteDocument(appwriteConstants.APPWRITE.DATABASE_ID,  appwriteConstants.APPWRITE.COLLECTIONS.TODO, todoId);
            res.send({ message: 'Todo deleted' });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    return router;
};

module.exports = todoRoutes;
