const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema(
    {
        category_id: {
            type: Number,
            require: true,
            unique: true,
        },
        category_name: {
            type: String,
            require: true,
            unique: true,
        },
        category_key: {
            type: String,
            require: true,
            unique: true,
        },
    },
    { timestamps: true },
);

// Trước khi lưu, tự động tăng giá trị category_id
CategorySchema.pre('save', function (next) {
    const category = this;
    if (!category.isNew) {
        // Chỉ thực hiện khi tạo mới người dùng, không thực hiện khi update
        return next();
    }
    Category.findOne({}, {}, { sort: { category_id: -1 } }, function (err, lastCategory) {
        if (err) {
            return next(err);
        }

        let categoryId = 1000;
        if (lastCategory) {
            categoryId = parseInt(lastCategory.category_id) + 1;
        } else {
            categoryId = 1001;
        }
        category.category_id = categoryId;
        next();
    });
});
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
