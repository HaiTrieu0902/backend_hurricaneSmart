const express = require('express');
const router = express.Router();
const userController = require('../controllers/User/userController');
const middlewareController = require('../controllers/Middleware/middlewareController');

/* get list user  */
router.get('/get-list-user', middlewareController.verifyToken, userController.getAllUSer);
router.get('/get-list-user-panigation', middlewareController.verifyToken, userController.getAllUSerPanigation);
router.get('/get-detail/:id', middlewareController.verifyToken, userController.getDetailUser);
router.delete('/detele-user/:id', middlewareController.verifyTokenRoleAdmin, userController.deleteUsers);
router.put('/update-user/:id', middlewareController.verifyToken, userController.updateUsers);

module.exports = router;
