const Router = require('express');
const AdminController = require('../controllers/admin.controller');
const checkAuth = require('../middlewares/superAdminMiddleware');
const router = new Router();

router.post('/registration', AdminController.registration);
router.post('/login', AdminController.login);
router.get('/authMe', checkAuth(['SUPERADMIN', 'ADMIN']), AdminController.authMe);
router.get('/refresh', AdminController.refresh);

module.exports = router;
// asdcsazsdfgxhgs
