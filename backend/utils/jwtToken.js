// Create and send token in cookie
const sendToken = (user, statusCode, res) => {
  try {
    // Create JWT token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
      expires: new Date(
        Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    console.log('🟡 Sending token response...');
    res.status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email
        }
      });

  } catch (error) {
    console.error('🔴 Send token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating token: ' + error.message
    });
  }
};

export default sendToken;