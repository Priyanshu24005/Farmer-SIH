import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import farmerRoutes from './routes/farmerRoutes.js';
import mandiRoutes from './routes/mandiRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';



const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Farmer Sih API is running');
});

app.use('/api/farmers', farmerRoutes);
app.use('/api/mandis', mandiRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);


export default app;