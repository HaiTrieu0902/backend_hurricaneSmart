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
            const { userId, month, year } = req.query;
            const user = await UserModel.findOne({ user_id: userId });
            if (!user) {
                return res.status(401).json({ error: 'Not found user ID, please try it again!' });
            }
            // if (month) {
            //     const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
            //     const endDate = moment(startDate).endOf('month');

            //     const transactions = await TransactionModel.find({
            //         user_id: userId,
            //         date: {
            //             $gte: startDate.toDate(),
            //             $lte: endDate.toDate(),
            //         },
            //     }).select('-_id -__v -user_id');
            //     return res.status(200).json({ data: transactions });
            // } else {
            //     const transactions = await TransactionModel.find({
            //         user_id: userId,
            //     }).select('-_id -__v -user_id');
            //     return res.status(200).json({ data: transactions });
            // }
            let transactions;
            if (month) {
                const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
                const endDate = moment(startDate).endOf('month');

                transactions = await TransactionModel.find({
                    user_id: userId,
                    date: {
                        $gte: startDate.toDate(),
                        $lte: endDate.toDate(),
                    },
                }).select('-_id -__v -user_id');
            } else {
                const startOfYear = moment(`${year}-01-01`, 'YYYY-MM-DD');
                const endOfYear = moment(startOfYear).endOf('year');

                transactions = await TransactionModel.find({
                    user_id: userId,
                    date: {
                        $gte: startOfYear.toDate(),
                        $lte: endOfYear.toDate(),
                    },
                }).select('-_id -__v -user_id');
            }
            const totalSpent = transactions.reduce((total, transaction) => {
                return total + transaction.amount;
            }, 0);

            // Nhóm các giao dịch theo category_key và tính tổng cho mỗi category_key
            const groupedTransactions = transactions.reduce((acc, transaction) => {
                const { category_key, amount } = transaction;

                console.log('hihi', acc);
                if (!acc[category_key]) {
                    acc[category_key] = { category_key, total: 0 };
                }
                acc[category_key].total += amount;
                return acc;
            }, {});

            const data = Object.values(groupedTransactions);

            // Tạo đối tượng JSON phản hồi
            const response = {
                message: 'Success',
                month: parseInt(month),
                year: parseInt(year),
                total_spent: totalSpent,
                data: data,
            };

            return res.status(200).json(response);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = reportController;
