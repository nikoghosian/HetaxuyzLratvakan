const Router = require('express');
const AdminController = require('../controllers/admin.controller');
const AuthMiddleware = require('../middlewares/authMiddleware');
const router = new Router();

router.post('/registration', AdminController.registration);
router.post('/login', AdminController.login);
router.get('/authMe', AuthMiddleware, AdminController.authMe);
router.get('/refresh', AdminController.refresh);

module.exports = router;
