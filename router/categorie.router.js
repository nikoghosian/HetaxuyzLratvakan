const Router = require('express');
const CategorieController = require('../controllers/categorie.controller');
const checkAuth = require('../middlewares/superAdminMiddleware');

const router = new Router();

router.post('/create', checkAuth(['SUPERADMIN']), CategorieController.create);
router.get('/getAll', CategorieController.getAll);
router.put('/edit/:id', checkAuth(['SUPERADMIN', 'ADMIN']), CategorieController.EditCategories);
router.delete(
  '/delete/:id',
  checkAuth(['SUPERADMIN', 'ADMIN']),
  CategorieController.DeleteCategories,
);

module.exports = router;
