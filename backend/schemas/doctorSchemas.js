const Joi = require("joi");

module.exports.doctorSchema = Joi.object({
    specialization: Joi.string().trim().required(),

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