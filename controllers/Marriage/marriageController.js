const { MarriageModel } = require('../../models');

const marriageController = {
    getAllMarriage: async (req, res) => {
        try {
            const marriage = await MarriageModel.find({}, '-_id -__v'); //-_id
            res.status(200).json({
                status: 200,
                message: 'Successfully retrieved marriage',
                data: marriage,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getDetailMarriage: async (req, res) => {
        try {
            const marriageId = req.query?.marriageId;
            if (!marriageId) {
                res.status(400).json({
                    message: 'Bad Request: Missing marriageId in the query parameters',
                    status: 400,
                });
                return;
            }
            const data = await MarriageModel.findOne({ marriage_id: marriageId }, '-_id -__v');
            if (data) {
                res.status(200).json({
                    message: 'Successfully',
                    status: 200,
                    data: data,
                });
            } else {
                res.status(40).json({
                    message: 'Marriage not found',
                    status: 401,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    addMarriage: async (req, res) => {
        try {
            const newMarriage = await new MarriageModel({
                name: req.body.name,
                code: req.body.code,
                company: req.body.company,
            });
            const marriage = await newMarriage.save();

            res.status(200).json({
                status: 200,
                message: 'Create Marriage Successfully',
                data: {
                    name: marriage?.name,
                    code: marriage?.code,
                    company: marriage?.company,
                },
            });
        } catch (error) {
            res.status(500).json({ error: 'data duplication error', message: error?.keyValue });
        }
    },

    updateMarriage: async (req, res) => {
        try {
            const marriageId = req.query?.marriageId;
            if (!marriageId) {
                res.status(400).json({
                    message: 'Bad Request: Missing marriageId in the query parameters',
                    status: 400,
                });
                return;
            }
            const updatedData = {
                name: req.body?.name,
                code: req.body?.code,
                company: req.body?.company,
            };
            const data = await MarriageModel.findOneAndUpdate({ marriage_id: marriageId }, updatedData, {
                new: true,
            }).select('-_id -__v');
            if (data) {
                res.status(200).json({
                    message: `Update marriage successfully`,
                    status: 200,
                    data: data,
                });
            } else {
                res.status(404).json({
                    message: 'Update marriage failed',
                    status: 404,
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    deleteMarriage: async (req, res) => {
        try {
            const marriageId = req.query?.marriageId;
            if (!marriageId) {
                res.status(400).json({
                    message: 'Bad Request: Missing marriageId in the query parameters',
                    status: 400,
                });
                return;
            }
            const data = await MarriageModel.deleteOne({ marriage_id: marriageId });
            if (data.deletedCount === 0) {
                res.status(404).json('Not found marriage');
            } else {
                res.status(200).json(`Delete marriage successful`);
            }
        } catch (error) {
            res.status(500).json('Delete marriage failed');
        }
    },
};

module.exports = marriageController;
