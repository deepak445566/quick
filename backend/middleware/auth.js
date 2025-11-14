import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Login first to access this resource'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Create user object from token (no database query)
    req.user = {
      _id: decoded.id,
      email: process.env.ADMIN_EMAIL || 'admin@stellarserve.com',
      fullname: 'Admin User', 
      userId: 'admin'
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};