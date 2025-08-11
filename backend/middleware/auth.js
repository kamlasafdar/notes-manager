import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  console.log("Authenticating token...");

  const authHeader = req.headers['authorization']; // Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log("Verified user from token:", user);
    req.user = user;
    next();
  });
}
