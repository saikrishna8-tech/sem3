import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import Middlewares & Utils
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput } from './middleware/sanitizeMiddleware.js';
import ApiError from './utils/ApiError.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());

// CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new ApiError(400, `CORS policy blocked access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// NoSQL Injection Protection
app.use(sanitizeInput);

// Request logging (Morgan)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Apply Global Rate Limiting
app.use(globalLimiter);

// API Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'aurabuy-backend-nodejs' });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to AuraBuy Node.js Migrated API Backend' });
});

// API Routes Mounting (no /api prefix — FastAPI gateway strips it before proxying)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/courses', courseRoutes);
app.use('/search', searchRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);

// Fallback Route for undefined paths
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
