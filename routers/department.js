const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/Department/departmentController');
const middlewareController = require('../controllers/Middleware/middlewareController');

/* get list department  */
router.get('/get-list-department', middlewareController.verifyToken, departmentController.getAllDepartment);
router.get('/get-detail-department', middlewareController.verifyToken, departmentController.getDetailDepartment);

router.post('/add-department', middlewareController.verifyToken, departmentController.addDepartments);
router.delete('/detele-department', middlewareController.verifyToken, departmentController.deleteDepartments);
router.put('/update-department', middlewareController.verifyToken, departmentController.updateDepartments);

module.exports = router;
