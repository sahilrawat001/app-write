// middleware/authMiddleware.js
const sdk = require('node-appwrite');

const authMiddleware = (client) => {
    console.log('hiiiiiiiiiiiii')
    return async (req, res, next) => {
        console.log(req);
        const sessionId = req.headers['session-id'];
        if (!sessionId) {
            return res.status(401).send('Unauthorized: No session ID provided');
        }
        console.log(sessionId);

        const users = new sdk.Account(client);

        try {
            // Check if the session exists for the user
            const session = await users.getSession(sessionId);
            console.log(session);
            if (!session || session.$id !== sessionId) {
                return res.status(401).send('Unauthorized: Invalid session');
            }

            req.userId = session.userId;  
            next();  
        } catch (error) {
            console.error('Authorization Error:', error.message);
            return res.status(401).send('Unauthorized: Invalid session');
        }
    };
};

module.exports = authMiddleware;
