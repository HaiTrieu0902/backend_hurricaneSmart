const mongoose = require('mongoose');

const DeparmentSchema = new mongoose.Schema(
    {
        department_id: {
            type: Number,
            require: true,
            unique: true,
        },
        name: {
            type: String,
            require: true,
            unique: true,
        },
        code: {
            type: String,
            require: true,
            unique: true,
        },
        company: {
            type: String,
        },
    },
    { timestamps: true },
);

// Trước khi lưu, tự động tăng giá trị user_id
DeparmentSchema.pre('save', function (next) {
    const department = this;
    if (!department.isNew) {
        // Chỉ thực hiện khi tạo mới người dùng, không thực hiện khi update
        return next();
    }

    Department.findOne({}, {}, { sort: { department_id: -1 } }, function (err, lastDepartment) {
        if (err) {
            return next(err);
        }

        if (lastDepartment) {
            department.department_id = lastDepartment.department_id + 1;
        } else {
            department.department_id = 1;
        }
        next();
    });
});

const Department = mongoose.model('Department', DeparmentSchema);
module.exports = Department;
