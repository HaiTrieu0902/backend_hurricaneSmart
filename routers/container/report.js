const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/Report/ReportController');
const middlewareController = require('../../controllers/Middleware/middlewareController');

/* get list user  */
router.get(
    '/get-report-limitation-category',
    middlewareController.verifyToken,
    reportController.getReportLimitationCategory,
);
router.get(
    '/get-report-monthOrYear-transaction',
    middlewareController.verifyToken,
    reportController.getReportMonthOrYearTransaction,
);

module.exports = router;
