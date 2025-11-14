import User from '../models/User.js';
import sendToken from '../utils/jwtToken.js';

export const registerUser = async (req, res) => {
  try {
    const { userId, fullname, email, password } = req.body;

    console.log('🟢 Registration attempt:', { userId, fullname, email });

    // Check if userId already exists
    const existingUserById = await User.findOne({ userId });
    if (existingUserById) {
      console.log('🔴 User ID already exists');
      return res.status(400).json({
        success: false,
        message: 'User ID already exists'
      });
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      console.log('🔴 Email already exists');
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user
    const user = await User.create({
      userId,
      fullname,
      email,
      password
    });

    console.log('✅ User created successfully');
    sendToken(user, 201, res);

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.code === 11000) {
      if (error.keyPattern.userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID already exists'
        });
      }
      if (error.keyPattern.email) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Login user
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

    // Find user in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Logout user
export const logoutUser = async (req, res, next) => {
  // ✅ Simple and effective
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

// Get currently logged in user details
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

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