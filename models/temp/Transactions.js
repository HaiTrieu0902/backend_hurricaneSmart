const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema(
    {
        transaction_id: {
            type: Number,
            require: true,
            unique: true,
        },
        category_id: {
            type: Number,
            require: true,
        },
        user_id: {
            type: Number,
            require: true,
        },
        amount: {
            type: Number,
            require: true,
        },
        note: {
            type: Number,
            require: true,
        },
        date: {
            type: Date,
            require: true,
        },
    },
    { timestamps: true },
);

// Trước khi lưu, tự động tăng giá trị transaction_id
TransactionSchema.pre('save', function (next) {
    const transaction = this;
    if (!transaction.isNew) {
        // Chỉ thực hiện khi tạo mới người dùng, không thực hiện khi update
        return next();
    }
    transaction.findOne({}, {}, { sort: { transaction_id: -1 } }, function (err, lastTransaction) {
        if (err) {
            return next(err);
        }

        let transactionId = 8000;
        if (lastTransaction) {
            transactionId = parseInt(lastTransaction.transaction_id) + 1;
        } else {
            transactionId = 8001;
        }
        transaction.transaction_id = transactionId;
        next();
    });
});
const Transactions = mongoose.model('Transactions', TransactionSchema);
module.exports = Transactions;
