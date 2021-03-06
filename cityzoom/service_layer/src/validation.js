const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);

function validateId(object) {
    const schema = {
        id: Joi.objectId()
    }
    return Joi.validate(object, schema)
}

function validatePatch(object) {
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(30).optional(),
        password: Joi.string().min(5).max(30).optional()
    }).or(['name', 'password'])
    return Joi.validate(object, schema)
}

function validateCreateUser(object) {
    const schema = Joi.object().keys({
        name: Joi.string().min(1).max(30).required(),
        username: Joi.string().min(1).max(30).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(5).max(30).required()
    })
    return Joi.validate(object, schema)
}

function validateLogin(object) {
    const schema = Joi.object().keys({
        username: Joi.string().min(1).max(30).required(),
        password: Joi.string().min(5).max(30).required()
    })
    return Joi.validate(object, schema)
}

function validateGetAllStreams(object) {
    const schema = Joi.object().keys({
        interval_start: Joi.number().integer(),
        interval_end: Joi.number().integer()
    })
    return Joi.validate(object, schema)
}

function validateGetStreamByID(object) {
    const schema = Joi.object().keys({
        stream_ID: Joi.string().required()
    })
    return Joi.validate(object, schema)
}

function validateGetDataFromStream(object) {
    const schema = Joi.object().keys({
        stream_ID: Joi.string().required(),
        interval_start: Joi.number().integer(),
        interval_end: Joi.number().integer()
    })
    return Joi.validate(object, schema)
}

function validateCreateDevice(object) {
   
    const schema = Joi.object().keys({
        device_ID: Joi.string().required(),
        device_name: Joi.string().required(),
        description: Joi.string().optional(),
        vertical: Joi.string().required(),
        mobile: Joi.boolean().required(),
        municipality: Joi.string().optional(),
        provider: Joi.string().required()
    })
    return Joi.validate(object, schema)
}

module.exports = {
    validateId,
    validatePatch,
    validateCreateUser,
    validateLogin,
    validateGetAllStreams,
    validateGetDataFromStream,
    validateGetStreamByID,
    validateCreateDevice
}
