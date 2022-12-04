const Joi = require('joi');

function registerValidate(data) {
    const schema = Joi.object(
        {
            name: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().min(10).required(),
            phonenumber: Joi.number().integer().required(),
            password: Joi.string().min(6).max(30).required(),
            genres: Joi.array().length(3).required()
        }
    )
    return schema.validate(data);
}

function loginValidate(data) {
    const schema = Joi.object(
        {
            email: Joi.string().email().min(10).required(),
            password: Joi.string().min(6).max(30).required()
        }
    )
    return schema.validate(data);
}

module.exports = {
    registerValidate,
    loginValidate
}