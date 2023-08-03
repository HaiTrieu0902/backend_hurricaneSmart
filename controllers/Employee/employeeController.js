const { EmployeeModel, DepartmentModel, MarriageModel } = require('../../models');
const PAGE_SIZE = 10;
const moment = require('moment');
const employeeController = {
    /* Cách 1 : truy vấn từ cách bình thường */
    getAllEmployee: async (req, res) => {
        try {
            const totalEmployee = await EmployeeModel.countDocuments({});
            const totalPage = Math.ceil(totalEmployee / PAGE_SIZE);
            const employees = await EmployeeModel.find({}, '-_id -__v'); // -_id

            const marriages = await MarriageModel.find({}, '-_id marriage_id name');
            const marriageMap = new Map(marriages.map((marriage) => [marriage.marriage_id, marriage.name]));

            const departments = await DepartmentModel.find({}, '-_id department_id name');
            const departmentMap = new Map(departments.map((department) => [department.department_id, department.name]));

            const employeeDataWithExtraFields = await Promise.all(
                employees.map(async (employee) => {
                    const { marriage_id, department_id, ...employeeData } = employee.toObject();
                    const marriage_name = marriageMap.get(marriage_id) || 'Unknown';
                    const department_name = departmentMap.get(department_id) || 'Unknown';
                    return {
                        ...employeeData,
                        marriage_id,
                        department_id,
                        marriage_name,
                        department_name,
                    };
                }),
            );

            res.status(200).json({
                status: 200,
                message: 'Get all employee successfully',
                data: employeeDataWithExtraFields,
                totalPage: totalPage,
                per_page: PAGE_SIZE,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllEmployeePanigation: async (req, res) => {
        try {
        } catch (error) {}
    },

    getDetailEmployee: async (req, res) => {},

    addEmployee: async (req, res) => {
        try {
            const dateOfBirth = moment(req.body.date_of_birth, 'DD/MM/YYYY');
            const today = moment();
            const age = today.diff(dateOfBirth, 'years');

            if (age < 18) {
                return res.status(400).json({
                    error: 'Invalid date_of_birth',
                    message: 'The employee must be at least 18 years old.',
                });
            }

            const newEmployee = await new EmployeeModel({
                employee_name: req.body.employee_name,
                card_number: req.body.card_number,
                gender: req.body.gender,
                email: req.body.email,
                mother_name: req.body.mother_name,
                date_of_birth: req.body.date_of_birth,
                place_of_birth: req.body.place_of_birth,
                home_address: req.body.home_address,
                mobile_no: req.body.mobile_no,
                marriage_id: req.body.marriage_id,
                bank_account: req.body.bank_account,
                bank_name: req.body.bank_name,
                department_id: req.body.department_id,
                position: req.body.position,
                basic_salary: req.body.basic_salary,
                account_user_id: req.body.account_user_id,
                benefits: req.body.benefits,
                academic_level: req.body.academic_level,
            });
            const employee = await newEmployee.save();
            // Xóa trường _id của MongoDB khỏi đối tượng employee
            const { _id, ...employeeData } = employee.toObject();
            res.status(200).json({
                status: 200,
                message: 'Create employee Successfully',
                data: employeeData,
            });
        } catch (error) {
            res.status(500).json({ error: 'data duplication error', message: error?.keyValue });
        }
    },

    updateEmployees: async (req, res) => {},

    deleteEmployees: async (req, res) => {},
};

module.exports = employeeController;
