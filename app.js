const express = require('express');
const sdk = require('node-appwrite');
const cors = require('cors');

const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
app.use(express.json());
app.use(cors());



const client = new sdk.Client();
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

app.use('/auth', authRoutes(client));
app.use('/api', todoRoutes(client));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
