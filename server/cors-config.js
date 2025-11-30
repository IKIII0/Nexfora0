// Simple CORS configuration
const cors = require('cors');

// Production origins
const productionOrigins = [
  'https://nexfora.vercel.app',
  'https://nexfora0-production.up.railway.app'
];

// Development origins
const developmentOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

// Get allowed origins based on environment
const getAllowedOrigins = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const origins = isDevelopment ? developmentOrigins : productionOrigins;
  
  console.log(`🌍 Environment: ${isDevelopment ? 'Development' : 'Production'}`);
  console.log(`📡 Allowed Origins:`, origins);
  
  return origins;
};

// CORS middleware
const corsMiddleware = cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
});

module.exports = {
  corsMiddleware,
  getAllowedOrigins
};
