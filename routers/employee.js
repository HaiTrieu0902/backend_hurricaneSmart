const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/Employee/employeeController');
const middlewareController = require('../controllers/Middleware/middlewareController');

/* get list user  */
router.get('/get-list-employee', middlewareController.verifyToken, employeeController.getAllEmployee);
router.get(
    '/get-list-employee-panigation',
    middlewareController.verifyToken,
    employeeController.getAllEmployeePanigation,
);

router.get('/add-employee', middlewareController.verifyToken, employeeController.addEmployee);

router.get('/get-detail/:id', middlewareController.verifyToken, employeeController.getDetailEmployee);
router.delete('/detele-employee/:id', middlewareController.verifyToken, employeeController.deleteEmployees);
router.put('/update-employee/:id', middlewareController.verifyToken, employeeController.updateEmployees);

module.exports = router;
