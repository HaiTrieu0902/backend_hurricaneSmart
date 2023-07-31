const mongoose = require('mongoose');
const validator = require('validator');
const EmployeeSchema = new mongoose.Schema(
    {
        employee_id: {
            type: Number,
            require: true,
            minlength: 6,
            maxlength: 255,
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
            minlength: 14,
            maxlength: 255,
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
            minlength: 10,
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
            default: 0,
        },
        bank_account: {
            type: Number,
            minlength: 10,
            require: true,
        },
        bank_name: {
            type: String,
            require: true,
        },
        department_id: {
            type: Number,
            default: 0,
        },
        position_id: {
            type: Number,
            default: 0,
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

// Thêm một hàm kiểm tra cho trường 'date_of_birth'
EmployeeSchema.path('date_of_birth').validate(function (value) {
    // Kiểm tra xem 'value' có phải là ngày tháng hợp lệ không
    if (!validator.isDate(value)) {
        return false;
    }

    // Tính tuổi dựa trên 'date_of_birth'
    const birthDate = new Date(value);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    // Kiểm tra nếu tuổi ít nhất là 18
    return age >= 18;
}, 'Nhân viên phải đủ 18 tuổi trở lên.');

// Trước khi lưu, tự động tăng giá trị user_id
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

        if (lastEmployee) {
            employee.employee_id = Math.max(lastEmployee.employee_id + 1, 1000);
        } else {
            employee.employee_id = 1000;
        }
        next();
    });
});
const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
