const express = require('express');
const router = express.Router();
const authController = require('../../controllers/Auth/authController');
const middlewareController = require('../../controllers/Middleware/middlewareController');

/* Resgister  */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', middlewareController.verifyToken, authController.logout);
router.post('/change-password', middlewareController.verifyToken, authController.changePassword);
module.exports = router;
