const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/Transaction/TransactionController');
const middlewareController = require('../../controllers/Middleware/middlewareController');

/* get list user  */
router.get('/get-all-transaction', middlewareController.verifyToken, transactionController.getAllTransaction);
router.get('/get-detail-transaction', middlewareController.verifyToken, transactionController.getDetailTransaction);
router.get('/get-transaction-user', middlewareController.verifyToken, transactionController.getDetailTransactionUser);
router.get(
    '/get-transaction-user-byMonth',
    middlewareController.verifyToken,
    transactionController.getDetailTransactionUserByMonth,
);
router.delete('/detele-transaction', middlewareController.verifyToken, transactionController.deleteTransaction);
router.post(
    '/detele-transaction-multiple',
    middlewareController.verifyToken,
    transactionController.deleteTransactionMultiple,
);

router.put(
    '/update-transaction',
    middlewareController.verifyToken,
    middlewareController.checkRuleUpdateTransaction,
    transactionController.updateTransaction,
);
router.post(
    '/add-transaction',
    middlewareController.verifyToken,
    // middlewareController.checkRuleAddTransaction,
    transactionController.addTransaction,
);

//transactionController.addTransaction, transactionController.updateTransaction
module.exports = router;
