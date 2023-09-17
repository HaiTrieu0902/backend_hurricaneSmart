const { UserModel, CategoryModel, TransactionModel } = require('../../models');
const moment = require('moment');

const reportController = {
    getReportLimitationCategory: async (req, res) => {
        try {
            const { userId, month, categoryKey, year } = req.query;

            if (!userId || !categoryKey || !month || !year) {
                return res.status(400).json({
                    message: 'Bad Request: Missing required parameters',
                    status: 400,
                });
            }

            const user = await UserModel.findOne({ user_id: userId });
            if (!user) {
                return res.status(401).json({ error: 'Not found user ID, please try it again!' });
            }

            const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
            const endDate = moment(startDate).endOf('month');

            const transactions = await TransactionModel.find({
                user_id: userId,
                category_key: categoryKey,
                date: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                },
            }).select('-_id -__v -user_id');

            if (transactions && transactions.length > 0) {
                return res.status(200).json({
                    message: `Get all transactions for user ID ${userId} successfully`,
                    status: 200,
                    userId: userId,
                    data: transactions,
                });
            } else {
                return res.status(200).json({
                    message: `Get all transactions for user ID ${userId} successfully`,
                    status: 200,
                    userId: userId,
                    data: transactions,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getReportMonthOrYearTransaction: async (req, res) => {
        try {
            return res.status(200).json({ message: 'getReportMonthOrYearTransaction' });
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = reportController;
