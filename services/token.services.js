const { Token } = require('../models/models');
const jwt = require('jsonwebtoken');

class TokenService {
  generateToken({ adminId, email, role }) {
    try {
      const token = jwt.sign({ adminId, email, role }, process.env.JWT_TOKEN_KEY, {
        expiresIn: '30d',
      });

      return {
        token,
      };
    } catch (e) {
      res.status(404).json({ success: false });
    }
  }
}

module.exports = new TokenService();
