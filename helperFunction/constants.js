// Load environment variables from .env file
require('dotenv').config();

module.exports = {
    APPWRITE: {
        DATABASE_ID: process.env.APPWRITE_DATABASE_ID,  // The ID of your database from .env
        COLLECTIONS: {
            TODO: process.env.APPWRITE_COLLECTION_TODO   // Collection ID from .env
        }
    }
};
