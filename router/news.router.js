const Router = require('express');
const newsController = require('../controllers/news.controller');
const checkAuth = require('../middlewares/superAdminMiddleware');

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
router.get('/getMostViewedByCountryId/:id', newsController.getMostViewedByCountryId);
router.get('/getMostViewedAndRelates/:id', newsController.getMostViewedAndRelatesNews);
router.delete('/delete/:id', newsController.deleteNews);
router.get('/latestNews/', newsController.getLatestNews);
router.get('/getCategoriesAndNews/:id', newsController.getCategoriesAndNews);
router.get('/getMostViewedVideo', newsController.getMostViewedVideo);
router.get('/calendar', newsController.getNewsByCalendar);
router.get('/watch', newsController.tesadaran);
router.put('/slider', newsController.slider);
router.get('/allViews', newsController.newsViews);

module.exports = router;
