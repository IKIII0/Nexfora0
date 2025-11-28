const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://nexfora0-production.up.railway.app'], // Add your frontend URLs
  credentials: true
}));

app.use(express.json());

// Test endpoint without authentication
app.get("/api/test", (req, res) => {
  res.json({
    status: "success",
    message: "API is working",
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
