import express from 'express';
import convertRoutes from './routes/convertRoutes.js';

const app = express();

app.use(express.json());

// API routes
app.use('/api', convertRoutes);

// Health check route
app.get('/', (req, res) => res.send('File Conversion API is running'));

export default app;
