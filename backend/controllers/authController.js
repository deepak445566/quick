import jwt from 'jsonwebtoken';

// Hardcoded login function
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are entered
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email and password'
      });
    }

    // ✅ Hardcoded credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@stellarserve.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'StellarServe123';

    console.log('🔐 Login attempt:', { email, adminEmail });

    if (email === adminEmail && password === adminPassword) {
      // ✅ Create temporary user object
      const tempUser = {
        _id: 'admin-user-id',
        email: adminEmail,
        fullname: 'Admin User',
        userId: 'admin'
      };

      // ✅ Generate JWT token DIRECTLY (sendToken function ke bina)
      const token = jwt.sign(
        { id: tempUser._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      // ✅ Set cookie DIRECTLY
      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      };

      console.log('🍪 Setting cookie with options:', cookieOptions);

      res.status(200)
        .cookie('token', token, cookieOptions)
        .json({
          success: true,
          token,
          user: tempUser,
          message: 'Login successful'
        });

    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Logout user
export const logoutUser = async (req, res, next) => {
  res.cookie('token', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    // ✅ Return hardcoded user info
    const user = {
      _id: 'admin-user-id',
      email: process.env.ADMIN_EMAIL || 'admin@stellarserve.com',
      fullname: 'Admin User',
      userId: 'admin'
    };

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};