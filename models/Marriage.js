const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        marriage_id: {
            type: Number,
            require: true,
            unique: true,
        },

        username: {
            type: String,
            require: true,
            minlength: 6,
            maxlength: 255,
            unique: true,
        },
        email: {
            type: String,
            require: true,
            minlength: 6,
            maxlength: 255,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 6,
            maxlength: 255,
        },
        role: {
            type: String,
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        department: {
            type: String,
            default: 'staff',
            require: true,
        },
    },
    { timestamps: true },
);

// Trước khi lưu, tự động tăng giá trị user_id
UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isNew) {
        // Chỉ thực hiện khi tạo mới người dùng, không thực hiện khi update
        return next();
    }

    User.findOne({}, {}, { sort: { user_id: -1 } }, function (err, lastUser) {
        if (err) {
            return next(err);
        }

        if (lastUser) {
            user.user_id = lastUser.user_id + 1;
        } else {
            user.user_id = 1;
        }
        next();
    });
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
// module.exports = mongoose.model('User', UserSchema);
