const { Categorie } = require('../models/models')

class CategorieController {

    async create(req, res) {
        try {
            const { title } = req.body;
            const categorie = await Categorie.create({ title })
            return res.json(categorie)
        } catch (e) {
            throw e
        }
    }
    async getAll(req, res) {
        try {
            const categories = await Categorie.findAll();
            return res.send(categories);
        } catch (e) {
            throw e
        }
    }
}

module.exports = new CategorieController()