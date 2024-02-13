const Router = require('express');
const LiveController = require('../controllers/live.controller');
const router = new Router();

router.post('/create', LiveController.create);
router.get('/getAll', LiveController.getAll);

module.exports = router;
