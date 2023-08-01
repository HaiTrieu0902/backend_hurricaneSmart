const DepartmentModel = require('../models/Department');

const departmentController = {
    /* get all department */
    getAllDepartment: async (req, res) => {
        try {
            const department = await DepartmentModel.find({}, '-_id -__v'); //-_id
            res.status(200).json({
                status: 200,
                message: 'Successfully retrieved department',
                data: department,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* getDetaildepartment */
    getDetailDepartment: async (req, res) => {
        try {
            const departmentId = req.query?.departmentId;
            if (!departmentId) {
                res.status(400).json({
                    message: 'Bad Request: Missing departmentId in the query parameters',
                    status: 400,
                });
                return;
            }
            const data = await DepartmentModel.findOne({ department_id: departmentId }, '-_id -__v');
            if (data) {
                res.status(200).json({
                    message: 'Successfully',
                    status: 200,
                    data: data,
                });
            } else {
                res.status(404).json({
                    message: 'Department not found',
                    status: 404,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    /*getDetailDepartment: async (req, res) => {
        try {
            const departmentId = req.query?.departmentId;
            if (departmentId) {
                DepartmentModel.findOne({ department_id: departmentId }, '-_id -__v')
                    .then((data) => {
                        if (data) {
                            res.status(200).json({
                                message: 'Successfully',
                                status: 200,
                                data: data,
                            });
                        } else {
                            res.status(404).json({
                                message: 'Department not found',
                                status: 404,
                            });
                        }
                    })
                    .catch((err) => {
                        res.status(500).json(err);
                    });
            } else {
                res.status(400).json({
                    message: 'Bad Request: Missing departmentId in the query parameters',
                    status: 400,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
     */

    /* add department*/
    addDepartments: async (req, res) => {
        try {
            const newDepartment = await new DepartmentModel({
                name: req.body.name,
                code: req.body.code,
                company: req.body.company,
            });
            const department = await newDepartment.save();

            res.status(200).json({
                status: 200,
                message: 'Create Department Successfully',
                data: {
                    name: department?.name,
                    code: department?.code,
                    company: department?.company,
                },
            });
        } catch (error) {
            res.status(500).json({ error: 'data duplication error', message: error?.keyValue });
        }
    },

    /* update department */
    updateDepartments: async (req, res) => {},

    /* Delete department */
    deleteDepartments: async (req, res) => {},
};

module.exports = departmentController;
