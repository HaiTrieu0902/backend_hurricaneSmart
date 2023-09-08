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
            const transactions = await TransactionModel.find({ user_id: userId }).select('-_id -__v -user_id');
            if (transactions && transactions.length > 0) {
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

    /* Get detail Transaction - User - Month*/
    getDetailTransactionUserByMonth: async (req, res) => {
        try {
            return res.status(200).json({ message: 'getDetailTransactionUserByMonth' });
        } catch (error) {}
    },

    /* add Transaction */
    addTransaction: async (req, res) => {
        try {
            const user = await UserModel.findOne({ user_id: req.body.user_id });
            if (!user) {
                return res.status(401).json({ error: 'Not found user ID, please try it again!' });
            }

            const category = await CategoryModel.findOne({ category_id: req.body.category_id });
            if (!category) {
                return res.status(401).json({ error: 'Not found category ID, please try it again!' });
            }
            const dateTransaction = moment(req.body.date, 'DD/MM/YYYY');

            const newTransaction = await new TransactionModel({
                user_id: req.body.user_id,
                category_id: req.body.category_id,
                amount: req.body.amount,
                date: dateTransaction,
                note: req.body.note,
            });
            const transaction = await newTransaction.save();
            const { _id, __v, ...transactionData } = transaction.toObject();
            res.status(200).json({
                status: 200,
                message: 'A new transaction has been created',
                data: transactionData,
            });
        } catch (error) {
            console.log('lỗi tại đây hả', error);
            res.status(500).json(error);
        }
    },

    /* Update Transaction*/
    updateTransaction: async (req, res) => {
        try {
            return res.status(200).json({ message: 'Update' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Delete Transaction */
    deleteTransaction: async (req, res) => {
        try {
            return res.status(200).json({ message: 'Delete' });
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
