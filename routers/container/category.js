const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/Category/CategoryController');
const middlewareController = require('../../controllers/Middleware/middlewareController');

/* get list user  */
router.get('/get-all-category', middlewareController.verifyToken, categoryController.getAllCategory);
router.get('/get-detail-category', middlewareController.verifyToken, categoryController.getDetailCategory);
router.delete('/detele-category', middlewareController.verifyToken, categoryController.deleteCategory);
router.put('/update-category', middlewareController.verifyToken, categoryController.updateCategory);
router.post('/add-category', middlewareController.verifyToken, categoryController.addCategory);
module.exports = router;
