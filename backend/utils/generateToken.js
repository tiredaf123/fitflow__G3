import jwt from 'jsonwebtoken';

const generateToken = (user, role = 'user') => {
  return jwt.sign(
    {
      id: user._id,
      role: role,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

export default generateToken;

