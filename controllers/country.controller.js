const { Country } = require('../models/models');

class CountryController {
  async create(req, res) {
    try {
      const { title } = req.body;

      const country = await Country.create({ title });

      return res.json(country);
    } catch (e) {
      throw e;
    }
  }

  async getAll(req, res) {
    try {
      const countries = await Country.findAll();

      return res.send(countries);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new CountryController();
