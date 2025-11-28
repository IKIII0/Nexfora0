const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Enhanced JSON parsing with debugging
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('=== POST/PUT Request Debug ===');
    console.log('Raw headers:', req.headers);
    
    // Check if content-type is JSON
    const contentType = req.headers['content-type'];
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      console.log('JSON request detected');
    } else {
      console.log('WARNING: Non-JSON content-type detected');
    }
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n=== ${req.method} ${req.path} - ${new Date().toISOString()} ===`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  next();
});

// Test endpoint without authentication
app.get("/api/test", (req, res) => {
  res.json({
    status: "success",
    message: "API is working",
    timestamp: new Date().toISOString()
  });
});

// Test auth endpoint without authentication
app.get("/api/auth/test", (req, res) => {
  res.json({
    status: "success",
    message: "Auth API is working",
    timestamp: new Date().toISOString()
  });
});

// Test POST endpoint without authentication
app.post("/api/test-post", (req, res) => {
  console.log('Test POST received:', req.body);
  res.json({
    status: "success",
    message: "POST test working",
    receivedBody: req.body,
    timestamp: new Date().toISOString()
  });
});

// Simple echo endpoint for debugging
app.post("/api/echo", (req, res) => {
  console.log('Echo endpoint received:', req.body);
  res.json({
    status: "success",
    echo: req.body,
    timestamp: new Date().toISOString()
  });
});

// Routes must come before error handlers
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    code: 500,
    message: "Internal server error"
  });
});

module.exports = app;
