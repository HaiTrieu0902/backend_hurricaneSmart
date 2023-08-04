const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/Employee/employeeController');
const middlewareController = require('../../controllers/Middleware/middlewareController');

/* get list user  */
router.get('/get-list-employee', middlewareController.verifyToken, employeeController.getAllEmployee);
router.get(
    '/get-list-employee-panigation',
    middlewareController.verifyToken,
    employeeController.getAllEmployeePanigation,
);
router.post('/add-employee', middlewareController.verifyToken, employeeController.addEmployee);
router.get('/get-detail/:id', middlewareController.verifyToken, employeeController.getDetailEmployee);
router.put('/update-employee/:id', middlewareController.verifyToken, employeeController.updateEmployees);
router.post('/detele-employee-multiple', middlewareController.verifyToken, employeeController.deleteEmployeeMultiple);
router.delete('/detele-employee', middlewareController.verifyToken, employeeController.deleteEmployees);
module.exports = router;
