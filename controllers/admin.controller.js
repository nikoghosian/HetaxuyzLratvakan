const { Admin } = require('../models/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token.services');
const ApiError = require('../execeptions/apiError');
const NewsDto = require('../models/models');

class AdminController {
  async registration(req, res) {
    try {
      const { email, password } = req.body;

      let role;
      const hashedPassword = await bcrypt.hash(password, 7);

      const newAdmin = await Admin.create({ email, password: hashedPassword });

      const token = tokenService.generateToken({ adminId: newAdmin.id, email, role: 'admin' });

      return res.status(201).json({ admin: newAdmin, token, role });
    } catch (e) {
      console.error(e);
      res.status(404).json({ success: false });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ where: { email } });

      if (!admin) {
        return res.status(404).json({ message: 'Incorrect email or password' });
      }

      const comparePassword = bcrypt.compareSync(password, admin.password);
      if (!comparePassword) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      const token = tokenService.generateToken({
        adminId: admin.id,
        email: admin.email,
        role: 'admin',
      });
      return res.json({ admin, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Login failed' });
    }
  }
}

module.exports = new AdminController();
