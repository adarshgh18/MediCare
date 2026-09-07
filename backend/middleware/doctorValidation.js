const { doctorSchema } = require("../schemas/doctorSchemas");

module.exports = (req, res, next) => {

    const { error } = doctorSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};