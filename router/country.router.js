const Router = require('express');
const CountryController = require('../controllers/country.controller');
const router = new Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', CountryController.create);
router.get('/getAll', CountryController.getAll);
router.put('/edit/:id', authMiddleware, CountryController.EditCountries);
router.delete('/delete/:id', authMiddleware, CountryController.DeleteCountries);
module.exports = router;
