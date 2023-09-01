const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            require: true,
            unique: true,
        },

        user_code: {
            type: String,
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
        fullname: {
            type: String,
            require: true,
            maxlength: 50,
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

        let lastUserId = 1000;
        if (lastUser) {
            lastUserId = parseInt(lastUser.user_id) + 1;
        } else {
            lastUserId = 1001;
        }
        user.user_id = lastUserId;
        user.user_code = `PGG_${user.user_id}`;
        next();
    });
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
