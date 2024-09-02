import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;  // Replace with your own secret key

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    secret,
    { expiresIn: '1h' }  // Token expiration time
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};
