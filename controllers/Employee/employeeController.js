const { EmployeeModel } = require('../../models');
const PAGE_SIZE = 10;

const employeeController = {
    getAllEmployee: async (req, res) => {
        try {
            const totalEmployee = await EmployeeModel.countDocuments({});
            const totalPage = Math.ceil(totalEmployee / PAGE_SIZE);
            const employee = await EmployeeModel.find({}, 'username email role user_id department'); //-_id
            res.status(200).json({
                status: 200,
                message: 'Get all employee successfully',
                data: employee,
                totalPage: totalPage,
                per_page: PAGE_SIZE,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllEmployeePanigation: async (req, res) => {},

    getDetailEmployee: async (req, res) => {},

    addEmployee: async (req, res) => {},

    updateEmployees: async (req, res) => {},

    deleteEmployees: async (req, res) => {},
};

module.exports = employeeController;
