import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { ensureBucketExists } from './config/storage';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to services
connectDB();
ensureBucketExists();

import gifRoutes from './routes/gifs';

// ... (previous code)

// Routes
app.use('/gifs', gifRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
