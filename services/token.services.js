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
      console.log(e);
    }
  }
}

module.exports = new TokenService();
