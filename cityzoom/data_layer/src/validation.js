const joi = require('joi')

function validateCreateDevice(object) {
    const schema = joi.object().keys({
        device_ID:  joi.string().required(),
        device_name: joi.string().required(),
        description: joi.string().optional(),
        vertical: joi.string().optional(),
        mobile: joi.boolean().required(),
        provider: joi.string().required()
    })
    return joi.validate(object, schema)
}

function validateCreateStream(object) {
    const schema = joi.object().keys({
        stream_ID: joi.string().required(),
        device_ID: joi.string().device_ID(),
        stream_name: joi.string().required(),
        type: joi.string().required(),
        description: joi.string().optional()
    })
    return joi.validate(object, schema)
}

function validateCreateSubscription(object){
    const schema = joi.object().keys({
        subscription_ID: joi.string().required(),
        stream_ID: joi.string().required(),
        device_ID: joi.string().device_ID(),
        subscription_name: joi.string().required(),
        description: joi.string().optional()
    })
    return joi.validate(object, schema)
}

function validatePostValue(object) {
    const schema = joi.object().keys({
        value: joi.number().required(),
        latitude: joi.number().required(),
        longitude: joi.number().required()
    })
}

module.exports = {
    validateCreateDevice,
    validateCreateStream,
    validateCreateSubscription
}