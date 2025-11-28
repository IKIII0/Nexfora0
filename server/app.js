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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    code: 500,
    message: "Internal server error"
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: "error", 
    code: 404,
    message: "API endpoint not found"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
