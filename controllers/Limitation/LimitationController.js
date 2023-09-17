const { UserModel, LimitationModel, CategoryModel, TransactionModel } = require('../../models');
const moment = require('moment');
const limitationController = {
    /* Get All Limitation */
    getAllLimitation: async (req, res) => {
        try {
            const allLimitations = await LimitationModel.find({}, '-_id -__v');
            const structuredData = {};

            allLimitations.forEach((limitation) => {
                const { user_id, month, year } = limitation;

                if (!structuredData[user_id]) {
                    structuredData[user_id] = [];
                }
                const userLimits = structuredData[user_id];
                const existingLimit = userLimits.find((limit) => limit.month === month && limit.year === year);
                if (existingLimit) {
                    existingLimit.data.push({
                        category_key: limitation.category_key,
                        amount_limit: limitation.amount_limit,
                        createdAt: limitation.createdAt,
                        updatedAt: limitation.updatedAt,
                        limitation_id: limitation.limitation_id,
                    });
                } else {
                    userLimits.push({
                        month,
                        year,
                        data: [
                            {
                                category_key: limitation.category_key,
                                amount_limit: limitation.amount_limit,
                                createdAt: limitation.createdAt,
                                updatedAt: limitation.updatedAt,
                                limitation_id: limitation.limitation_id,
                            },
                        ],
                    });
                }
            });

            res.status(200).json({
                status: 200,
                message: 'Get all limitation successfully',
                data: structuredData,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Get detail Limitation */
    getDetailLimitation: async (req, res) => {
        try {
            const limitationId = req.query?.limitationId;
            const limitation = await LimitationModel.findOne({ limitation_id: limitationId }, '-id -__v');

            if (limitation) {
                return res.status(200).json({
                    message: `Get detail limitation ID ${limitationId} successfully`,
                    status: 200,
                    data: limitation,
                });
            } else {
                return res.status(404).json('Not Found Limitation ID');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Get detail Limitation - User*/
    getDetailLimitationUser: async (req, res) => {
        try {
            const userId = req.query?.userId;
            if (!userId) {
                return res.status(400).json({
                    message: 'Bad Request: Missing required parameters',
                    status: 400,
                });
            }
            const limitations = await LimitationModel.find({ user_id: userId }).select('-_id -__v');
            if (limitations && limitations.length > 0) {
                // Tạo một đối tượng để tổ chức lại dữ liệu
                const organizedData = {
                    user_id: userId,
                    limitations: [],
                };

                // Lặp qua danh sách giới hạn và tổ chức chúng theo month và year
                limitations.forEach((limitation) => {
                    const { month, year } = limitation;
                    const existingEntry = organizedData.limitations.find(
                        (entry) => entry.month === month && entry.year === year,
                    );
                    if (existingEntry) {
                        existingEntry.categories.push({
                            category_key: limitation.category_key,
                            amount_limit: limitation.amount_limit,
                            limitation_id: limitation.limitation_id,
                        });
                    } else {
                        organizedData.limitations.push({
                            month,
                            year,
                            categories: [
                                {
                                    category_key: limitation.category_key,
                                    amount_limit: limitation.amount_limit,
                                    limitation_id: limitation.limitation_id,
                                },
                            ],
                        });
                    }
                });
                return res.status(200).json({
                    message: `Get all limitations for user ID ${userId} successfully`,
                    status: 200,
                    data: organizedData,
                });
            } else {
                return res.status(404).json('No limitations found for this user ID');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Get detail Limitation - User - Month*/
    getDetailLimitationUserByMonth: async (req, res) => {
        try {
            const { userId, month, year } = req.query;
            if (!userId || !month || !year) {
                return res.status(400).json({
                    message: 'Bad Request: Missing required parameters',
                    status: 400,
                });
            }
            const limitations = await LimitationModel.find({ user_id: userId, month: month, year: year }).select(
                '-_id -__v',
            );
            if (limitations && limitations.length > 0) {
                const totalAmountLimit = limitations.reduce((total, limitation) => {
                    return total + limitation.amount_limit;
                }, 0);
                return res.status(200).json({
                    message: `Get all limitations for user ID ${userId},${month}/${year} successfully`,
                    status: 200,
                    totalAmountLimit: totalAmountLimit,
                    user_id: Number(userId),
                    month: Number(month),
                    year: Number(year),
                    data: limitations.map((limitation) => {
                        const { category_key, amount_limit, createdAt, updatedAt, limitation_id } = limitation;
                        return {
                            category_key,
                            amount_limit,
                            createdAt,
                            updatedAt,
                            limitation_id,
                        };
                    }),
                });
            } else {
                return res.status(404).json('No limitations found for this user ID or Month or Year');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Get detail Limitation - transaction - User - Month*/
    getdetailLimitationTransactionUserByMonth: async (req, res) => {
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

            const userTransactions = await TransactionModel.find(
                {
                    user_id: userId,
                    date: {
                        $gte: startDate.toDate(),
                        $lte: endDate.toDate(),
                    },
                },
                '-_id -__v',
            );
            const userLimitations = await LimitationModel.find({ user_id: userId, month: month, year: year }).select(
                '-_id -__v',
            );

            const result = {
                status: 200,
                message: `get detail Limitation Transaction User ${userId} By Month`,
                user_id: Number(userId),
                month: Number(month),
                total_spent: 0,
                total_limit: 0,
                year: Number(year),
                data: [],
            };

            const categorySpentMap = {};

            userTransactions.forEach((transaction) => {
                const { category_key, amount } = transaction;
                if (!categorySpentMap[category_key]) {
                    categorySpentMap[category_key] = 0;
                }
                categorySpentMap[category_key] += amount;
            });

            userLimitations.forEach((limitation) => {
                const { category_key, amount_limit } = limitation;
                const amount_spent = categorySpentMap[category_key] || 0;
                result.data.push({
                    category_key,
                    amount_spent,
                    amount_limit,
                });
            });
            const totalSpent = result.data.reduce((total, item) => total + item.amount_spent, 0);
            const totalLimit = result.data.reduce((total, item) => total + item.amount_limit, 0);
            result.total_spent = totalSpent;
            result.total_limit = totalLimit;
            return res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* add limitation */
    addLimitation: async (req, res) => {
        try {
            const user = await UserModel.findOne({ user_id: req.body.user_id });
            if (!user) {
                return res.status(401).json({ error: 'Not found user ID, please try it again!' });
            }

            const category = await CategoryModel.findOne({ category_key: req.body.category_key });
            if (!category) {
                return res.status(401).json({ error: 'Not found category key, please try it again!' });
            }

            const existingLimitation = await LimitationModel.findOne({
                user_id: req.body.user_id,
                category_key: req.body.category_key,
                month: req.body.month,
                year: req.body.year,
            });

            if (existingLimitation) {
                return res
                    .status(400)
                    .json({ error: 'Limitation already exists for this user, category, month, and year!' });
            }
            const newLimitation = await new LimitationModel({
                category_key: req.body.category_key,
                user_id: req.body.user_id,
                amount_limit: req.body.amount_limit,
                month: req.body.month,
                year: req.body.year,
            });
            const limmitation = await newLimitation.save();
            res.status(200).json({
                status: 200,
                message: 'Create new limitation Successfully',
                data: {
                    limmitation_id: limmitation.limitation_id,
                    category_key: limmitation.category_key,
                    user_id: limmitation.user_id,
                    amount_limit: limmitation.amount_limit,
                    createAt: limmitation.createdAt,
                    updatedAt: limmitation.updatedAt,
                },
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Update limitation*/
    updateLimitation: async (req, res) => {
        try {
            const { userId, month, year, categoryKey } = req.query;
            if (!userId || !month || !year || !categoryKey) {
                return res.status(400).json({
                    message: 'Bad Request: Missing required parameters',
                    status: 400,
                });
            }

            const updatedData = {
                amount_limit: req.body?.amount_limit,
            };
            const limitations = await LimitationModel.findOneAndUpdate(
                {
                    user_id: userId,
                    category_key: categoryKey,
                    month: month,
                    year: year,
                },
                updatedData,
                {
                    new: true,
                },
            ).select('-_id -__v -user_id -month -year');
            if (limitations) {
                res.status(200).json({
                    message: `Update category successfully`,
                    user_id: userId,
                    month: month,
                    year: year,
                    status: 200,
                    data: limitations,
                });
            } else {
                return res.status(401).json('Not Found Limitation for User');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Delete Limitation */
    deleteLimitation: async (req, res) => {
        try {
            const limitationId = req.query?.limitationId;
            const limitation = await LimitationModel.findOne({ limitation_id: limitationId });
            if (limitation) {
                LimitationModel.deleteOne({ limitation_id: limitationId })
                    .then((data) => {
                        res.status(200).json(`Limitation ID: ${limitation?.limitation_id} has delete successfully`);
                    })
                    .catch((err) => {
                        res.status(401).json('Delete limitation failed');
                    });
            } else {
                res.status(404).json('Not found limitation ID');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
module.exports = limitationController;
