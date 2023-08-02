const mongoose = require('mongoose');

const MarriageSchema = new mongoose.Schema(
    {
        marriage_id: {
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

MarriageSchema.pre('save', function (next) {
    const marriage = this;
    if (!marriage.isNew) {
        return next();
    }

    Marriage.findOne({}, {}, { sort: { marriage_id: -1 } }, function (err, lastMarriage) {
        if (err) {
            return next(err);
        }

        if (lastMarriage) {
            marriage.marriage_id = lastMarriage.marriage_id + 1;
        } else {
            marriage.marriage_id = 1;
        }
        next();
    });
});

const Marriage = mongoose.model('Marriage', MarriageSchema);
module.exports = Marriage;
