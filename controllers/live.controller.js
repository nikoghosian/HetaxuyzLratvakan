const { Live } = require('../models/models');

class LiveController {
  async create(req, res) {
    try {
      const { id: userId } = req.user;
      const { url, title } = req.body;
      const live = await Live.create({ url, title });
      return res.json(live);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async getAll(req, res) {
    try {
      const live = await Live.findAll({ order: [['createdAt', 'DESC']] });

      return res.send(live);
    } catch (e) {
      throw e;
    }
  }
  async edit(req, res) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const { url, title } = req.body;
      const live = await Live.findByPk(id);
      if (!live) {
        return res.status(404).json({ success: false });
      }
      live.url = url;
      live.title = title;
      await live.save();
      return res.send(live);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false });
    }
  }
  async delete(req, res) {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      await Live.destroy({
        where: {
          id,
        },
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false });
    }
  }
}

module.exports = new LiveController();
