const Router = require('express');
const CountryController = require('../controllers/country.controller');
const router = new Router();
const checkAuth = require('../middlewares/superAdminMiddleware');

router.post('/create', checkAuth(['SUPERADMIN']), CountryController.create);
router.get('/getAll', CountryController.getAll);
router.put('/edit/:id', checkAuth(['SUPERADMIN', 'ADMIN']), CountryController.EditCountries);
router.delete('/delete/:id', checkAuth(['SUPERADMIN', 'ADMIN']), CountryController.DeleteCountries);
module.exports = router;
