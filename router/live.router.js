const Router = require('express');
const LiveController = require('../controllers/live.controller');
const checkAuth = require('../middlewares/superAdminMiddleware');

const router = new Router();

router.post('/create', checkAuth(['SUPERADMIN', 'ADMIN']), LiveController.create);
router.get('/getAll', LiveController.getAll);
router.put('/edit/:id', checkAuth(['SUPERADMIN', 'ADMIN']), LiveController.edit);
router.delete('/delete/:id', checkAuth(['SUPERADMIN', 'ADMIN']), LiveController.delete);
module.exports = router;
