const express = require('express');
const router = express.Router();
const limitationController = require('../../controllers/Limitation/LimitationController');
const middlewareController = require('../../controllers/Middleware/middlewareController');

/* get list user  */
router.get('/get-all-limitation', middlewareController.verifyToken, limitationController.getAllLimitation);
router.get('/get-detail-limitation', middlewareController.verifyToken, limitationController.getDetailLimitation);
router.get('/get-limitation-user', middlewareController.verifyToken, limitationController.getDetailLimitationUser);
router.get(
    '/get-limitation-user-byMonth',
    middlewareController.verifyToken,
    limitationController.getDetailLimitationUserByMonth,
);

router.get(
    '/get-limitation-transaction-user-byMonth',
    middlewareController.verifyToken,
    limitationController.getdetailLimitationTransactionUserByMonth,
);

router.delete('/detele-limitation', middlewareController.verifyToken, limitationController.deleteLimitation);
router.put('/update-limitation', middlewareController.verifyToken, limitationController.updateLimitation);
router.post('/add-limitation', middlewareController.verifyToken, limitationController.addLimitation);
module.exports = router;
