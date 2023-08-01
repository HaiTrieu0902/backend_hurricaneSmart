const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const middlewareController = require('../controllers/middlewareController');

/* get list department  */
router.get('/get-list-department', middlewareController.verifyToken, departmentController.getAllDepartment);
router.get('/get-detail-department', middlewareController.verifyToken, departmentController.getDetailDepartment);

router.post('/add-department', middlewareController.verifyToken, departmentController.addDepartments);
router.delete('/detele-department', middlewareController.verifyToken, departmentController.deleteDepartments);
router.put('/update-department', middlewareController.verifyToken, departmentController.updateDepartments);

module.exports = router;
