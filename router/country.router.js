const Router = require('express');
const CountryController = require('../controllers/country.controller');
const router = new Router();

router.post('/create', CountryController.create);
router.get('/getAll', CountryController.getAll);

module.exports = router;
