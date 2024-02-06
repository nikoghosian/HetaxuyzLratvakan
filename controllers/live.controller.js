const { Live } = require('../models/models');

class LiveController {
  async create(req, res) {
    try {
      const { url } = req.body;
      const live = await Live.create({ url });
      return res.json(live);
    } catch (e) {
      throw e;
    }
  }
  async getAll(req, res) {
    try {
      const live = await Live.findAll();
      return res.send(live);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new LiveController();
