const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// CORS configuration - Railway production only
const allowedOrigins = [
  'https://nexfora.vercel.app',
  'https://nexfora-production.up.railway.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
  })
);

app.use(express.json());

// Enhanced JSON parsing with debugging
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
