const Router = require('express');
const newsController = require('../controllers/news.controller');
const { NewsContent } = require('../models/models');

const router = Router();

router.post('/create', newsController.create);
router.get('/getAll', newsController.getAll);
router.get('/getOne/:id', newsController.getOne);
router.get('/getToday', newsController.getTodaysNews);
router.get('/getMostViewed', newsController.getMostViewed);
router.get('/search', newsController.search);
router.get('/filter', newsController.filters);
router.get('/relatesNews', newsController.relatesNews);
router.put('/editNews/:id', newsController.editNews);

module.exports = router;
