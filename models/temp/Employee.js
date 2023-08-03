const mongoose = require('mongoose');
const validator = require('validator');
const EmployeeSchema = new mongoose.Schema(
    {
        employee_id: {
            type: Number,
            require: true,
            unique: true,
        },
        employee_code: {
            type: String,
            require: true,
            unique: true,
        },
        employee_name: {
            type: String,
            require: true,
            maxlength: 255,
        },
        card_number: {
            type: String,
            require: true,
            minlength: 10,
            maxlength: 255,
            unique: true,
        },
        gender: {
            type: Number,
            require: true,
        },
        email: {
            type: String,
            require: true,
            minlength: 10,
            maxlength: 255,
            unique: true,
        },
        mother_name: {
            type: String,
            require: true,
            maxlength: 255,
        },
        date_of_birth: {
            type: Date,
            require: true,
        },
        place_of_birth: {
            type: String,
            require: true,
        },
        home_address: {
            type: String,
            require: true,
        },
        mobile_no: {
            type: Number,
        },
        marriage_id: {
            type: Number,
            default: 1,
        },
        bank_account: {
            type: Number,
            minlength: 9,
            require: true,
        },
        bank_name: {
            type: String,
            require: true,
        },
        department_id: {
            type: Number,
            default: 1,
        },
        position: {
            type: String,
            default: 'fresher',
        },
        basic_salary: {
            type: Number,
            require: true,
        },
        account_user_id: {
            type: Number,
            require: true,
        },
        benefits: {
            type: [],
            default: ['On leave', 'Social insurance contribution', 'Bonus'],
        },
        academic_level: {
            type: [],
            default: ['THPT'],
        },
    },
    { timestamps: true },
);

EmployeeSchema.pre('save', function (next) {
    const employee = this;
    if (!employee.isNew) {
        // Chỉ thực hiện khi tạo mới người dùng, không thực hiện khi update
        return next();
    }

    Employee.findOne({}, {}, { sort: { employee_id: -1 } }, function (err, lastEmployee) {
        if (err) {
            return next(err);
        }

        let lastEmployeeId = 1000;
        if (lastEmployee) {
            lastEmployeeId = lastEmployee.employee_id;
        }
        employee.employee_id = lastEmployeeId + 1;
        employee.employee_code = `PGG_${employee.employee_id}`;
        next();
    });
});

const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
