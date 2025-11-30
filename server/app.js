const express = require("express");
const { corsMiddleware } = require("./cors-config");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Apply CORS middleware
app.use(corsMiddleware);

// Handle preflight requests
app.options('*', corsMiddleware);

app.use(express.json());
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    console.log("=== POST/PUT Request Debug ===");
    console.log("Raw headers:", req.headers);

    // Check if content-type is JSON
    const contentType = req.headers["content-type"];
    console.log("Content-Type:", contentType);

    if (contentType && contentType.includes("application/json")) {
      console.log("JSON request detected");
    } else {
      console.log("WARNING: Non-JSON content-type detected");
    }
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `\n=== ${req.method} ${req.path} - ${new Date().toISOString()} ===`
  );
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Content-Length:", req.headers["content-length"]);
  next();
});

// Routes must come before error handlers
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    code: 500,
    message: "Internal server error",
  });
});

module.exports = app;
