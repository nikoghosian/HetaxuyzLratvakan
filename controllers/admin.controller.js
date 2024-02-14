const { Admin } = require('../models/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token.services');

class AdminController {
  async registration(req, res) {
    try {
      const { email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 7);

      const newAdmin = await Admin.create({ email, password: hashedPassword });
      const { accessToken, refreshToken } = tokenService.generateToken({
        role: 'ADMIN',
        id: newAdmin.id,
      });
      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(201).json({ ...newAdmin.toJSON(), accessToken });
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
        role: 'ADMIN',
        id: admin.id,
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({ ...admin.toJSON(), accessToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Login failed' });
    }
  }
  async authMe(req, res) {
    try {
      const { id } = req.admin;
      const admin = await Admin.findOne({
        where: {
          id,
        },
      });
      if (!admin) {
        return res.status(400).json({ success: false, message: 'Something was Wrong' });
      }
      const { accessToken, refreshToken } = tokenService.generateToken({
        role: 'ADMIN',
        id: admin.id,
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });

      return res.send({ ...admin.toJSON(), accessToken });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false });
    }
  }
  async refresh(req, res) {
    try {
      const { refreshToken: oldToken } = req.cookies;

      const token = jwt.verify(oldToken, process.env.JWT_REFRESH_KEY);

      if (!token) {
        return res.status(400).json({ success: false });
      }

      const { accessToken, refreshToken } = tokenService.generateToken({
        role: 'ADMIN',
        id: oldToken.id,
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });

      return res.send({ accessToken });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false });
    }
  }
}

module.exports = new AdminController();
