const jwt = require('jsonwebtoken');

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'No Authorization' });
      }
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);

      if (decoded.role !== role) {
        return res.status(403).json({ message: 'No Admin Rules' });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: 'No Authorization' });
    }
  };
};
