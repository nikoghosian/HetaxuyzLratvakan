const TokenService = require('../services/TokenService');
const { Admin } = require('../models/models');

class TokenController {
  async generateToken(req, res) {
    try {
      const { username, password } = req.body;

      const admin = await Admin.findOne({ where: { username, password } });

      if (!admin) {
        return res.status(401).json({ message: 'Uncorrect User Data' });
      }
      return res.json(token);
    } catch (error) {
      console.error('Error with Token generation', error);
      return res.status(500).json({ message: 'Server Error' });
    }
  }

  async validateToken(req, res) {
    try {
      const { token } = req.body;

      const Token = TokenService.validateToken(token);

      if (!Token) {
        return res.status(401).json({ message: 'Wrong Token or Not Expires' });
      }

      return res.json(Token);
    } catch (error) {
      console.error('Error whith Token generation:', error);
      return res.status(500).json({ message: 'Server Error' });
    }
  }
}

module.exports = new TokenController();
