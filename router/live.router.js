const Router = require('express');
const LiveController = require('../controllers/live.controller');
const checkAuthMiddleware = require('../middlewares/authMiddleware');
const router = new Router();

router.post('/create', checkAuthMiddleware, LiveController.create);
router.get('/getAll', LiveController.getAll);
router.put('/edit/:id', checkAuthMiddleware, LiveController.edit);
router.delete('/delete/:id', checkAuthMiddleware, LiveController.delete);
module.exports = router;
