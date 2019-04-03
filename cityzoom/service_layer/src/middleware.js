
const jwt = require('jsonwebtoken')
const User = require('./db/models/user')
const validationDebug = require('debug')('app:Validation')
const errorDebug = require('debug')('app:Error')
const fs = require('fs')
const config = require('config')

/*  Middleware to ease the validation of user inputs
    method: Validation function to run
    object: The key attribute of the request to validate (params, body...)
    message: Message to display to the user
*/
function validationMiddleware(method, object, message = null, code = 400) {
    return function (req, res, next) {
        const { error } = method(req[object])
        if (error) {
            validationDebug(`Error occurred while validating ${JSON.stringify(req[object])} on the endpoint ${req.originalUrl} with the function ${method.name}:\n${error.message}`)
            res.status(code).send(message ? message : error.message)
        } else {
            next()
        }
    }
}

async function authentication(req, res, next) {

    if (req.header('Authorization') == null) return res.sendStatus(401)
    const token = req.header('Authorization').replace('Bearer ', '')
    let decoded = null
    try {
        decoded = jwt.verify(token, config.get('TOKEN_GENERATION_SECRET'))
    } catch (e) {
        return res.sendStatus(401)
    }
    const user = await User.findOne({ username: decoded.username })
    if (!user) return res.sendStatus(401)
    req.user = user
    next()
}

function error(err, req, res, next) {
    fs.appendFileSync('logfile.log', new Date().toISOString() + " - " + err.message + ', requestpath: ' + req.originalUrl + ', request body: ' + JSON.stringify(req.body) + '\n');
    errorDebug(err.message + ', requestpath: ' + req.originalUrl + ', request body: ' + JSON.stringify(req.body))
    res.status(500).send('Internal Server Error')
}

module.exports = {
    validationMiddleware,
    authentication,
    error
}
