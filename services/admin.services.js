const Admin = require('../models/models').Admin;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenServices = require('./token.services');
const ApiError = require('../exceptions/apiError');

class AdminService {
  async registration(email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await Admin.create({ email, password: hashedPassword });

      const token = tokenServices.generateToken({ adminId: newAdmin.id });

      await tokenServices.saveToken(newAdmin.id, token);

      return { token, admin: newAdmin };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AdminService();
