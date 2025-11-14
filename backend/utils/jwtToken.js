const sendToken = (user, statusCode, res) => {
  // Create JWT token
  const token = user.getJwtToken();

  console.log('🔐 Sending token to user:', user.email);
  console.log('🌍 Current environment:', process.env.NODE_ENV);

  // ✅ Fixed cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: false, // ✅ Temporary false karein - local testing ke liye
    sameSite: 'lax', // ✅ Temporary lax karein
    path: '/'
  };

  // ✅ Production mein secure aur sameSite change karein
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'none';
  }

  console.log('🍪 Cookie Options:', cookieOptions);

  res.status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token, // ✅ Response mein bhi token bhejein
      user,
      message: 'Login successful - check browser cookies'
    });
};

export default sendToken;