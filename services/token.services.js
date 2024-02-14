const { Token } = require('../models/models');
const jwt = require('jsonwebtoken');

class TokenService {
  generateToken(payload) {
    try {
      const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_KEY, {
        expiresIn: '15m',
      });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
        expiresIn: '30d',
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      res.status(404).json({ success: false });
    }
  }
  validateAccessToken(token) {
    try {
      const adminData = jwt.verify(token, process.env.JWT_TOKEN_KEY);
      return adminData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const adminData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
      return adminData;
    } catch (e) {
      return null;
    }
  }
}

module.exports = new TokenService();
