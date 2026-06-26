import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db';
import errorHandler from './middleware/errorHandler';

// Import Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import reviewRoutes from './routes/reviews';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';

// Load Env
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folders
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Base route
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Shop Here API Server is running.' });
});

// Centralized error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); // Trigger restart

export default app;

