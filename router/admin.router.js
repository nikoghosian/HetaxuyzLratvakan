const Router = require('express');
const AdminController = require('../controllers/admin.controller');
const router = new Router();

router.post('/registration', AdminController.registration);
router.post('/login', AdminController.login);

module.exports = router;
