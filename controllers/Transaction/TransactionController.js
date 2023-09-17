const { UserModel, CategoryModel, TransactionModel } = require('../../models');
const moment = require('moment');

const transactionController = {
    /* Get All Transaction */
    getAllTransaction: async (req, res) => {
        try {
            const totalTransaction = await TransactionModel.countDocuments({});
            const transactions = await TransactionModel.find({}, '-id -__v ');
            res.status(200).json({
                status: 200,
                message: 'Get all transactions successfully',
                total: totalTransaction,
                data: transactions,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Get detail Transaction */
    getDetailTransaction: async (req, res) => {
        try {
            const transactionId = req.query?.transactionId;
            const transaction = await TransactionModel.findOne({ transaction_id: transactionId }, '-id -__v');

            if (transaction) {
                return res.status(200).json({
                    message: `Get detail Transaction ID ${transactionId} successfully`,
                    status: 200,
                    data: transaction,
                });
            } else {
                return res.status(404).json('Not Found Transaction ID');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Get detail Transaction - User*/
    getDetailTransactionUser: async (req, res) => {
        try {
            const userId = req.query?.userId;
            if (!userId) {
                return res.status(400).json({
                    message: 'Bad Request: Missing required parameters',
                    status: 400,
                });
            }

            const user = await UserModel.findOne({ user_id: req.query?.userId });
            if (!user) {
                return res.status(401).json({ error: 'Not found user ID, please try it again!' });
            }

            const transactions = await TransactionModel.find({ user_id: userId }).select('-_id -__v -user_id');
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

    getDetailTransactionUserByMonth: async (req, res) => {
        try {
            const { userId, month, year } = req.query;
            if (!userId || !month || !year) {
                return res.status(400).json({
                    message: 'Bad Request: Missing required parameters',
                    status: 400,
                });
            }
            const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD'); // Ngày đầu tháng
            const endDate = moment(startDate).endOf('month'); // Ngày cuối tháng
            const data = await TransactionModel.find(
                {
                    user_id: userId,
                    date: {
                        $gte: startDate.toDate(),
                        $lte: endDate.toDate(),
                    },
                },
                '-_id -__v',
            );
            let totalAmount = 0;
            const groupedData = {};
            data.forEach((transaction) => {
                const transactionDate = moment(transaction.date).format('YYYY-MM-DD');
                totalAmount += transaction.amount;
                const { user_id, date, createdAt, updatedAt, ...transactionRes } = transaction.toObject();
                if (!groupedData[transactionDate]) {
                    groupedData[transactionDate] = {
                        date: transactionDate,
                        totalAmountDate: transaction.amount,
                        transactions: [transactionRes],
                    };
                } else {
                    groupedData[transactionDate].totalAmountDate += transaction.amount;
                    groupedData[transactionDate].transactions.push(transactionRes);
                }
            });
            const valueTransactionFilterMonth = Object.values(groupedData);
            valueTransactionFilterMonth.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            res.status(200).json({
                message: 'Filtered Transaction Data by User ID, Month, and Year',
                status: 200,
                totalAmount: totalAmount,
                userId: userId,
                data: valueTransactionFilterMonth,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* add Transaction */
    addTransaction: async (req, res) => {
        try {
            const user = await UserModel.findOne({ user_id: req.body.user_id });
            if (!user) {
                return res.status(401).json({ error: 'Not found user ID, please try it again!' });
            }

            const category = await CategoryModel.findOne({ category_key: req.body.category_key });
            if (!category) {
                return res.status(401).json({ error: 'Not found category Key, please try it again!' });
            }
            const dateTransaction = moment.utc(req.body.date, 'DD/MM/YYYY');

            const newTransaction = await new TransactionModel({
                user_id: req.body.user_id,
                category_key: req.body.category_key,
                amount: req.body.amount,
                note: req.body.note,
                date: dateTransaction,
            });
            const transaction = await newTransaction.save();
            const { _id, __v, ...transactionData } = transaction.toObject();
            res.status(200).json({
                status: 200,
                message: 'A new transaction has been created',
                data: transactionData,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Update Transaction*/
    updateTransaction: async (req, res) => {
        try {
            const transactionId = req.query?.transactionId;
            if (!transactionId) {
                return res.status(400).json({
                    message: 'Bad Request: Missing transactionId in the query parameters',
                    status: 400,
                });
            }

            const category = await CategoryModel.findOne({ category_key: req.body.category_key });
            if (!category) {
                return res.status(401).json({ error: 'Not found category ID, please try it again!' });
            }

            const dateTransaction = moment.utc(req.body.date, 'DD/MM/YYYY');
            const updatedData = {
                category_key: req.body.category_key,
                amount: req.body.amount,
                note: req.body.note,
                date: dateTransaction,
            };
            const data = await TransactionModel.findOneAndUpdate({ transaction_id: transactionId }, updatedData, {
                new: true,
            }).select('-_id -__v');
            if (data) {
                res.status(200).json({
                    message: `Update Transaction ID: ${transactionId} successfully`,
                    status: 200,
                    data: data,
                });
            } else {
                res.status(401).json({
                    message: 'Update Transaction failed',
                    status: 401,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Delete Transaction */
    deleteTransaction: async (req, res) => {
        try {
            const transactionId = req.query?.transactionId;
            const transaction = await TransactionModel.findOne({ transaction_id: transactionId });
            if (transaction) {
                TransactionModel.deleteOne({ transaction_id: transactionId })
                    .then((data) => {
                        res.status(200).json(`Transaction ID: ${transaction?.transaction_id} has delete successfully`);
                    })
                    .catch((err) => {
                        res.status(401).json('Delete Transaction failed');
                    });
            } else {
                res.status(404).json('Not found Transaction ID');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Delete Transaction multiple */
    deleteTransactionMultiple: async (req, res) => {
        try {
            return res.status(200).json({ message: 'Delete' });
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
module.exports = transactionController;
