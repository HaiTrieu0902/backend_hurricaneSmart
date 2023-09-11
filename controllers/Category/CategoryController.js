const { CategoryModel, LimitationModel } = require('../../models');
const { getDetailLimitationUserByMonth } = require('../Limitation/LimitationController');

const categoryController = {
    /* Get all category */
    getAllCategory: async (req, res) => {
        try {
            const totalCategory = await CategoryModel.countDocuments({});
            const category = await CategoryModel.find({}, '-id -__v -password -role'); //-_id
            res.status(200).json({
                status: 200,
                message: 'Get all category successfully',
                total: totalCategory,
                data: category,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* get Detail Category */
    getDetailCategory: async (req, res) => {
        try {
            const categoryKey = req.query?.category_key;
            CategoryModel.findOne({ category_key: categoryKey }, '-id -__v')
                .then((data) => {
                    res.status(200).json({
                        message: 'get detail category successfully',
                        status: 200,
                        data: data,
                    });
                })
                .catch((err) => {
                    res.status(404).json('Not Found user');
                });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* add category*/
    addCategory: async (req, res) => {
        try {
            const newCategory = await new CategoryModel({
                category_name: req.body.category_name,
                category_key: req.body.category_key,
            });
            const category = await newCategory.save();
            res.status(200).json({
                status: 200,
                message: 'Create new category Successfully',
                data: {
                    category_id: category.category_id,
                    category_name: category?.category_name,
                    category_key: category?.category_key,
                },
            });
        } catch (error) {
            res.status(500).json({ error: 'data duplication error', message: error?.keyValue });
        }
    },

    /* update category */
    updateCategory: async (req, res) => {
        try {
            const categoryId = req.query?.category_id;
            const updatedData = {
                category_name: req.body?.category_name,
                category_key: req.body?.category_key,
            };
            const data = await CategoryModel.findOneAndUpdate({ category_id: categoryId }, updatedData, {
                new: true,
            }).select('-_id -__v');
            if (data) {
                res.status(200).json({
                    message: `Update category successfully`,
                    status: 200,
                    data: data,
                });
            } else {
                res.status(401).json({
                    message: 'Update category failed',
                    status: 401,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Delete user */
    deleteCategory: async (req, res, next) => {
        try {
            const categoryKey = req.query?.category_key;
            const category = await CategoryModel.findOne({ category_key: categoryKey });
            if (category) {
                CategoryModel.deleteOne({ category_key: categoryKey })
                    .then((data) => {
                        res.status(200).json(`${category?.category_name} has delete successfully`);
                    })
                    .catch((err) => {
                        res.status(500).json('Delete category failed');
                    });
            } else {
                res.status(500).json('Not found category ID');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Get category month limiation */
    getUserCategoryLitationMonth: async (req, res) => {
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
                const category = await CategoryModel.find({}, '-id -__v -password -role'); // Lấy danh sách category

                // Duyệt qua danh sách category và kiểm tra amount_limit từ limitations
                const modifiedCategory = category.map((cat) => {
                    const limitation = limitations.find((limit) => limit.category_key === cat.category_key);

                    if (limitation && limitation.amount_limit > 0) {
                        return { ...cat.toObject(), isLimiation: true };
                    } else {
                        return { ...cat.toObject(), isLimiation: false };
                    }
                });

                res.status(200).json({
                    status: 200,
                    message: 'Get all category user limitation successfully',
                    userID: userId,
                    total: category.length,
                    month: parseInt(month),
                    year: parseInt(year),
                    data: modifiedCategory,
                });
            } else {
                const totalCategory = await CategoryModel.countDocuments({});
                const category = await CategoryModel.find({}, '-id -__v -password -role'); //-_id
                res.status(200).json({
                    status: 200,
                    message: 'Get all category successfully',
                    total: totalCategory,
                    data: category,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = categoryController;
