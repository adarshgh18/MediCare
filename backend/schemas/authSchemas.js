const Joi = require("joi");


// ----------------------------------
// Patient Register Schema
// ----------------------------------

const registerSchema = Joi.object({

    fullName: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),

    username: Joi.string()
        .trim()
        .min(3)
        .max(20)
        .required(),

    email: Joi.string()
        .email()
        .trim()
        .required(),

    password: Joi.string()
        .min(8)
        .required(),

});


// ----------------------------------
// Doctor Register Schema
// ----------------------------------

const doctorRegisterSchema = Joi.object({

    fullName: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),

    username: Joi.string()
        .trim()
        .min(3)
        .max(20)
        .required(),

    email: Joi.string()
        .email()
        .trim()
        .required(),

    password: Joi.string()
        .min(8)
        .required(),

    specialization: Joi.string()
        .trim()
        .required(),

    experience: Joi.number()
        .min(0)
        .required(),

    consultationFee: Joi.number()
        .min(0)
        .required(),

    qualification: Joi.string()
        .trim()
        .required(),

    hospital: Joi.string()
        .trim()
        .required(),

    bio: Joi.string()
        .allow("")
        .optional(),

});


// ----------------------------------
// Login Schema
// ----------------------------------

const loginSchema = Joi.object({

    username: Joi.string()
        .trim()
        .required(),

    password: Joi.string()
        .required(),

});


module.exports = {
    registerSchema,
    doctorRegisterSchema,
    loginSchema,
};