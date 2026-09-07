const {
    registerSchema,
    doctorRegisterSchema,
    loginSchema
} = require("../schemas/authSchemas");


exports.validateRegister = (req, res, next) => {

    const { error } =
        registerSchema.validate(req.body);

    if (error) {

        return res.status(400).json({

            success: false,

            message:
                error.details[0].message,

        });

    }

    next();

};


exports.validateDoctorRegister = (req, res, next) => {

    const { error } =
        doctorRegisterSchema.validate(req.body);

    if (error) {

        return res.status(400).json({

            success: false,

            message:
                error.details[0].message,

        });

    }

    next();

};


exports.validateLogin = (req, res, next) => {

    const { error } =
        loginSchema.validate(req.body);

    if (error) {

        return res.status(400).json({

            success: false,

            message:
                error.details[0].message,

        });

    }

    next();

};