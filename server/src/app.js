import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import farmerRoutes from './routes/FarmerRoutes.js';
import mandiRoutes from './routes/MandiRoutes.js';
import authRoutes from './routes/authRoutes.js';


const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Farmer Sih API is running');
});

app.use('/api/farmers', farmerRoutes);
app.use('/api/mandis', mandiRoutes);
app.use('/api/auth', authRoutes);


export default app;