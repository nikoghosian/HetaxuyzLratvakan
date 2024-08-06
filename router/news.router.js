const Router = require('express');
const newsController = require('../controllers/news.controller');
const checkAuth = require('../middlewares/superAdminMiddleware');

const router = Router();

router.post('/create', checkAuth(['SUPERADMIN', 'ADMIN']), newsController.create);
router.get('/getAll', newsController.getAll);
router.get('/getOne/:id', newsController.getOne);
router.get('/getToday', newsController.getTodaysNews);
router.get('/getMostViewed', newsController.getMostViewed);
router.get('/search', newsController.search);
router.get('/filter', newsController.filters);
router.get('/relatesNews', newsController.relatesNews);
router.put('/editNews/:id', checkAuth(['SUPERADMIN', 'ADMIN']), newsController.editNews);
router.get('/getMostViewedByCountryId/:id', newsController.getMostViewedByCountryId);
router.get('/getMostViewedAndRelates/:id', newsController.getMostViewedAndRelatesNews);
router.delete('/delete/:id', checkAuth(['SUPERADMIN', 'ADMIN']), newsController.deleteNews);
router.get('/latestNews/', newsController.getLatestNews);
router.get('/getCategoriesAndNews/:id', newsController.getCategoriesAndNews);
router.get('/getMostViewedVideo', newsController.getMostViewedVideo);
router.get('/calendar', newsController.getNewsByCalendar);
router.get('/watch', newsController.tesadaran);
router.put('/slider', checkAuth(['SUPERADMIN', 'ADMIN']), newsController.slider);
module.exports = router;
///asdasdasd
