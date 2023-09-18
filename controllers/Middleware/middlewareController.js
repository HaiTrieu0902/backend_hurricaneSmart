const jwt = require('jsonwebtoken');
const moment = require('moment');
const { UserModel, CategoryModel, TransactionModel, LimitationModel } = require('../../models');
const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization;
        const decode = token?.split(' ')[1];
        if (token) {
            jwt.verify(decode, process.env.JWT_KEY_TOKEN, (err, data) => {
                if (err) {
                    return res.status(403).json({ message: 'Token is invalid' });
                }
                req.data = data;
                next();
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    },

    verifyTokenRoleAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.data?.user_code === req.query.user_code) {
                next();
            } else {
                return res.status(401).json({ message: 'You are not allowed to delete other, you can delete you' });
            }
        });
    },

    checkRuleAddTransaction: async (req, res, next) => {
        try {
            const { user_id, category_key, date, amount } = req.body;
            const dateTransaction = moment(date, 'DD/MM/YYYY');
            const month = dateTransaction.month() + 1;
            const year = dateTransaction.year();

            const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD'); // Ngày đầu tháng
            const endDate = moment(startDate).endOf('month'); // Ngày cuối tháng
            const userTransactions = await TransactionModel.find(
                {
                    category_key: category_key,
                    user_id: user_id,
                    date: {
                        $gte: startDate.toDate(),
                        $lte: endDate.toDate(),
                    },
                },
                '-_id -__v',
            );
            const userLimitations = await LimitationModel.findOne({
                user_id: user_id,
                month: month,
                year: year,
                category_key: category_key,
            }).select('-_id -__v');

            const totalSpent = userTransactions.reduce((total, item) => total + item.amount, 0) + Number(amount);
            const totalTotal = userLimitations?.amount_limit ? userLimitations?.amount_limit : 0;
            if (totalTotal >= totalSpent) {
                next();
            } else {
                res.status(401).json({
                    message: `Your Bag has ${
                        totalTotal - userTransactions.reduce((total, item) => total + item.amount, 0)
                    },you can't Enter the amount too ${
                        totalTotal - userTransactions.reduce((total, item) => total + item.amount, 0)
                    }, You need update spent limited now!! `,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    checkRuleUpdateTransaction: async (req, res, next) => {
        try {
            const { category_key, date, amount } = req.body;
            const transactionId = req.query.transactionId;
            const dateTransaction = moment(date, 'DD/MM/YYYY');
            const month = dateTransaction.month() + 1;
            const year = dateTransaction.year();
            const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD'); // Ngày đầu tháng
            const endDate = moment(startDate).endOf('month'); // Ngày cuối tháng

            const transaction = await TransactionModel.findOne({
                transaction_id: transactionId,
            });

            const userLimitations = await LimitationModel.findOne({
                user_id: transaction?.user_id,
                month: month,
                year: year,
                category_key: category_key,
            }).select('-_id -__v');

            const userTransactions = await TransactionModel.find(
                {
                    category_key: category_key,
                    user_id: transaction?.user_id,
                    date: {
                        $gte: startDate.toDate(),
                        $lte: endDate.toDate(),
                    },
                },
                '-_id -__v',
            );
            const totalSpent = userTransactions.reduce((total, item) => total + item.amount, 0) + Number(amount);
            const totalTotal = userLimitations?.amount_limit ? userLimitations?.amount_limit : 0;
            if (totalTotal >= totalSpent) {
                next();
            } else {
                return res.status(401).json({
                    message: `Your Bag has ${
                        totalTotal - userTransactions.reduce((total, item) => total + item.amount, 0)
                    },you can't Update the amount too ${
                        totalTotal - userTransactions.reduce((total, item) => total + item.amount, 0)
                    }, You need update spent limited now!! `,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = middlewareController;
