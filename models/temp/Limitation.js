const mongoose = require('mongoose');
const LimitationSchema = new mongoose.Schema(
    {
        limitation_id: {
            type: Number,
            require: true,
            unique: true,
        },
        category_key: {
            type: String,
            require: true,
            unique: false,
        },
        user_id: {
            type: Number,
            require: true,
            unique: false,
        },
        amount_limit: {
            type: Number,
            require: true,
        },
        month: {
            type: Number,
            require: true,
        },
        year: {
            type: Number,
            require: true,
        },
    },
    { timestamps: true },
);

// Trước khi lưu, tự động tăng giá trị limitation_id
LimitationSchema.pre('save', function (next) {
    const limitation = this;
    if (!limitation.isNew) {
        // Chỉ thực hiện khi tạo mới người dùng, không thực hiện khi update
        return next();
    }
    Limitation.findOne({}, {}, { sort: { limitation_id: -1 } }, function (err, lastLimitation) {
        if (err) {
            return next(err);
        }

        let LimitationId = 3000;
        if (lastLimitation) {
            LimitationId = parseInt(lastLimitation.limitation_id) + 1;
        } else {
            LimitationId = 3001;
        }
        limitation.limitation_id = LimitationId;
        next();
    });
});
const Limitation = mongoose.model('Limitation', LimitationSchema);
module.exports = Limitation;
