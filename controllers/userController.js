const UserModel = require('../models/User');
const PAGE_SIZE = 5;

const userController = {
    /* get all user */
    getAllUSer: async (req, res) => {
        try {
            const totalUser = await UserModel.countDocuments({});
            const totalPage = Math.ceil(totalUser / PAGE_SIZE);
            const users = await UserModel.find({}, 'username email role user_id department'); //-_id
            res.status(200).json({
                status: 200,
                message: 'Get all users successfully',
                data: users,
                totalPage: totalPage,
                per_page: PAGE_SIZE,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // phân trang user ( nếu số lượng user lớn hơn 20)
    getAllUSerPanigation: async (req, res) => {
        try {
            const page = req.query?.page;
            /* Tính tổng trang page */
            const totalUser = await UserModel.countDocuments({});
            const totalPage = Math.ceil(totalUser / PAGE_SIZE);
            /* Render data panigation */
            if (page) {
                const skipAuth = (parseInt(page) - 1) * PAGE_SIZE;
                UserModel.find({}, 'username email role user_id department')
                    .skip(skipAuth)
                    .limit(PAGE_SIZE)
                    .then((data) => {
                        if (data?.length > 0) {
                            res.status(200).json({
                                page: parseInt(page),
                                message: `get list page ${page} panigation success`,
                                status: 200,
                                data: data,
                                total: data.length,
                                totalPage: totalPage,
                            });
                        } else {
                            return res.status(500).json('get failed data');
                        }
                    })
                    .catch((err) => {
                        res.status(500).json('get failed data');
                    });
            } else {
                await userController.getAllUSer(req, res);
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    /* getDetailUser */
    getDetailUser: async (req, res, next) => {
        try {
            const idUser = req.params?.id;
            UserModel.findById(idUser, 'username email role')
                .then((data) => {
                    res.status(200).json({
                        message: 'get user success',
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

    /* update user */
    updateUsers: async (req, res) => {
        try {
            const userId = req.params?.id;
            UserModel.findByIdAndUpdate(userId, {
                department: req.body.department,
            })
                .then((data) => {
                    res.status(200).json({ message: 'update user success', status: 200 });
                })
                .catch((err) => {
                    res.status(500).json('Update department failed');
                });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* Delete user */
    deleteUsers: async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.params?.id);
            if (user) {
                UserModel.deleteOne({ _id: req.params.id })
                    .then((data) => {
                        res.status(200).json('Delete successful');
                    })
                    .catch((err) => {
                        res.status(500).json('Delete failed');
                    });
            } else {
                res.status(500).json('Not found ID');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = userController;
