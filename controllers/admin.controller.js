const { Admin } = require('../models/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token.services');

class AdminController {
  async registration(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ where: { email } });
      if (admin) {
        return res.status(409).json({ success: false });
      }

      const hashedPassword = await bcrypt.hash(password, 7);

      const newAdmin = await Admin.create({ email, password: hashedPassword, role: 'ADMIN' });
      const { accessToken, refreshToken } = tokenService.generateToken({
        role: newAdmin.role,
        id: newAdmin.id,
      });

      return res.status(201).json({ ...newAdmin.toJSON(), accessToken, refreshToken });
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
        return res.status(400).json({ message: 'Incorrect email or password' });
      }

      const { accessToken, refreshToken } = tokenService.generateToken({
        role: admin.role,
        id: admin.id,
      });

      return res.json({ ...admin.toJSON(), accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Login failed' });
    }
  }
  async authMe(req, res) {
    try {
      const { id } = req.user;
      // const { id } = req.admin;
      const admin = await Admin.findOne({
        where: {
          id,
        },
      });
      if (!admin) {
        return res.status(400).json({ success: false, message: 'Something was Wrong' });
      }
      const { accessToken, refreshToken } = tokenService.generateToken({
        role: admin.role,
        id: admin.id,
      });

      return res.send({ ...admin.toJSON(), accessToken, refreshToken });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false });
    }
  }
  async refresh(req, res) {
    try {
      const { refreshToken: oldToken } = req.query;

      const token = jwt.verify(oldToken, process.env.JWT_REFRESH_KEY);

      if (!token) {
        return res.status(400).json({ success: false });
      }

      const { accessToken, refreshToken } = tokenService.generateToken({
        role: oldToken.role,
        id: oldToken.id,
      });

      return res.send({ accessToken, refreshToken });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false });
    }
  }

  async registerSuperAdmin(req, res) {
    try {
      const { email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 7);

      const newAdmin = await Admin.create({ email, password: hashedPassword, role: 'SUPERADMIN' });
      const { accessToken, refreshToken } = tokenService.generateToken({
        role: newAdmin.role,
        id: newAdmin.id,
      });

      return res.status(201).json({ ...newAdmin.toJSON(), accessToken, refreshToken });
    } catch (e) {
      console.error(e);
      res.status(404).json({ success: false });
    }
  }
}

module.exports = new AdminController();
