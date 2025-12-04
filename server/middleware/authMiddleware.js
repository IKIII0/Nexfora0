const jwt = require('jsonwebtoken');

// Authenticate token middleware
const authenticateToken = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: 'Token akses diperlukan'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: 'Token tidak valid atau sudah kadaluarsa'
      });
    }
    
    req.user = user;
    next();
  });
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: 'Autentikasi diperlukan'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: "error",
      code: 403,
      message: 'Akses ditolak. Hanya admin yang diizinkan.'
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  isAdmin
};
