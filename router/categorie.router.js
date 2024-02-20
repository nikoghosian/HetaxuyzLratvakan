const Router = require('express');
const CategorieController = require('../controllers/categorie.controller');
const CheckAuthMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

router.post('/create', CheckAuthMiddleware, CategorieController.create);
router.get('/getAll', CheckAuthMiddleware, CategorieController.getAll);
router.put('/edit/:id', CheckAuthMiddleware, CategorieController.EditCategories);
router.delete('/delete/:id', CheckAuthMiddleware, CategorieController.DeleteCategories);

module.exports = router;
