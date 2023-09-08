const { UserModel, CategoryModel } = require('../../models');

const transactionController = {
    /* Get All Transaction */
    getAllTransaction: async (req, res) => {
        try {
            return res.status(200).json({ message: 'get' });
        } catch (error) {}
    },

    /* Get detail Transaction */
    getDetailTransaction: async (req, res) => {
        try {
            return res.status(200).json({ message: 'get detail' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Get detail Transaction - User*/
    getDetailTransactionUser: async (req, res) => {
        try {
            return res.status(200).json({ message: 'get detail' });
        } catch (error) {
            return res.status(200).json({ message: 'getDetailTransactionUser' });
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
            return res.status(200).json({ message: 'addTransaction' });
        } catch (error) {
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
