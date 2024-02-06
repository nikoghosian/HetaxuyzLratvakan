const Router = require('express');
const CategorieController = require('../controllers/categorie.controller');
const categorieController = require('../controllers/categorie.controller');
const router = new Router();

router.post('/create', CategorieController.create);
router.get('/getAll', categorieController.getAll);

module.exports = router;
