const { Categorie } = require('../models/models');

class CategorieController {
  async create(req, res) {
    try {
      const { title } = req.body;

      const categorie = await Categorie.create({ title });
      return res.json(categorie);
    } catch (e) {
      throw e;
    }
  }
  async getAll(req, res) {
    try {
      const categories = await Categorie.findAll();
      return res.send(categories);
    } catch (e) {
      throw e;
    }
  }
  async EditCategories(req, res) {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const categorie = await Categorie.findByPk(id);
      if (!categorie) {
        res.status(404).json('No Category whith this Id ');
      }
      categorie.title = title;
      await categorie.save();

      res.send(categorie);
    } catch (e) {
      console.log(e);
      res.status(404).json({ success: false });
    }
  }

  async DeleteCategories(req, res) {
    try {
      const { id } = req.params;
      await Categorie.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(404).json({ success: false });
    }
  }
}

module.exports = new CategorieController();
