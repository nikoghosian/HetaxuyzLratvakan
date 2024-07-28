const { Country } = require('../models/models');

class CountryController {
  async create(req, res) {
    const { id: userId } = req.user;
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

  async EditCountries(req, res) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const { title } = req.body;

      const countries = await Country.findByPk(id);
      if (!countries) {
        res.status(404).json('No Category whith this Id ');
      }
      countries.title = title;
      await countries.save();

      return res.send(countries);
    } catch (e) {
      console.log(e);
      res.status(404).json({ success: false });
    }
  }
  async DeleteCountries(req, res) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      await Country.destroy({
        where: {
          id,
        },
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      res.status(404).json({ success: false });
    }
  }
}

module.exports = new CountryController();
