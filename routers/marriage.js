const express = require('express');
const router = express.Router();
const marriageController = require('../controllers/marriageController');
const middlewareController = require('../controllers/middlewareController');

/* get list department  */
router.get('/get-list-marriage', middlewareController.verifyToken, marriageController.getAllMarriage);
router.get('/get-detail-marriage', middlewareController.verifyToken, marriageController.getDetailMarriage);
router.post('/add-marriage', middlewareController.verifyToken, marriageController.addMarriage);
router.delete('/detele-marriage', middlewareController.verifyToken, marriageController.deleteMarriage);
router.put('/update-marriage', middlewareController.verifyToken, marriageController.updateMarriage);

module.exports = router;
