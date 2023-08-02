const { EmployeeModel } = require('../../models');
const PAGE_SIZE = 10;

const employeeController = {
    getAllEmployee: async (req, res) => {
        res.json('hihihi');
    },

    getAllEmployeePanigation: async (req, res) => {},

    getDetailEmployee: async (req, res) => {},

    addEmployee: async (req, res) => {},

    updateEmployees: async (req, res) => {},

    deleteEmployees: async (req, res) => {},
};

module.exports = employeeController;
