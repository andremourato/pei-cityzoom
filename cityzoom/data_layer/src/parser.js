/*
 * API Endpoints:
 * create stream         -> localhost:8000/czb/stream (POST)  
 * post data to stream   -> localhost:8000/czb/stream (PUT)
 * read data from stream -> localhost:8000/czb/stream (GET)
 * list all streams      -> localhost:8000/czb/stream/list (GET)
 * delete stream         -> localhost:8000/czb/stream (DELETE)
 * 
 */
const { run, genDataCreationPayload } = require('./kafka-producer')
const create = require('./kafka-admin')
const prod = require('./kafka-producer')
const consumer = require('./kafka-consumer')
const Joi = require('joi')
const mongoose = require('mongoose')
const express = require('express')
const thread = require('worker_threads')
const process = require('child_process');
const router = express.Router()

const streamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30,
        unique: true
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 200
    },
    mobile: {
        type: Boolean,
    },
    type: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30
    },
    ttl: {
        type: Number,
        min: 10
    },
    periodicity: {
        type: Number,
        min: 10
    },
    creation: {
        type: Number,
        required: true
    },
    lastUpdate: {
        type: Number,
        required: true
    }
})

const latSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
})

const valueSchema = new mongoose.Schema({
    stream_name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 256
    },
    timestamp: {
        type: Number,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})

const Stream = mongoose.model('Stream', streamSchema)
const Values = mongoose.model('Value', valueSchema)

// create stream -- Passing
router.post('/', async (req,res) => {
    const {error} = validateCreate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //temp
    var account = 'user_1'

    //kafka
    var exist;
    await Stream.findOne({ name: req.body.name }, (err, stream) => {
        exist = stream
    })
    if (exist !== null) {
        console.log(`{ERROR GENERATED @ czb/stream } [${new Date()}] { METHOD: POST } Failure: \x1b[31mFailed to create stream ${req.body.name}\x1b[0m`)
        return res.status(409).send({
            "status": "Stream " + req.body.name + " already exists!"
        })
    }
    await create.createStream(req.body.name)
    var tstamp = Number(new Date())
    var new_stream = {
        name: req.body.name,
        description: req.body.description || '',
        mobile: req.body.mobile || false,
        type: req.body.type,
        ttl: req.body.ttl || 12000,
        periodicity: req.body.periodicity || 1200,
        creation: tstamp,
        lastUpdate: tstamp
    }

    let stream = new Stream(new_stream)

    stream = await stream.save()
        .then((result) => {
            console.log('saved: ', result)
        }).catch((err) => {
            console.log('error: ', err)
        });

    if (req.body.periodicity != 0) {
        req.body.periodicity
    }
    else {
        req.body.periodicity = 1200
    }

    res.status(201).send({
        status: 'Created data stream',
        name: req.body.name,
        account,
        periodicity: req.body.periodicity
    })

})

// put data into stream
router.put('/',async (req,res) => {
    const {error} = validatePutData(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const stream_name = await Stream.findOne({name: req.body.stream_name})

    if(stream_name === null) return res.status(404).send({
        "Error": `Stream ${req.body.stream_name} not found`
    });
    
    //var payload = prod.genDataCreationPayload('user_1', req.body.stream_name, req.body.value, Number(new Date()), req.body.location)
    //console.log(payload)
    //setTimeout(() => prod.putData(payload), 0)

    var tstamp = Number(new Date())
    const v = new Values({
        stream_name: req.body.stream_name,
        timestamp: tstamp,
        value: req.body.values
    })
    await v.save()

    await Stream.updateOne({name: req.body.stream_name}, {lastUpdate: tstamp})
    res.status(200).send()
})

// get values of stream with stream ID -- Passing
router.get('/values', async (req,res) => {
  
    const {error} = validateQueryGetDataString(req.query)
    if(error) return res.status(400).send(error.details[0].message);

    const exist = await Stream.findOne({name: req.query.stream})
    if (exist === null) {
        return res.status(404).send({
            "status": "Stream "+req.body.stream+" not found"
        })
    }
    const query = await Values.find({stream_name: req.query.stream})
        
    res.status(200).send({
        "stream_name": req.query.stream,
        "total": query.length,
        "values": query
    })
})

// get all streams -- Passing
router.get('/list', async (req,res) => {
  
    const {error} = validateQueryGetStreamsString(req.query);
    if(error) return res.status(400).send(error.details[0].message);

    console.log(req.query)

    var query = await Stream.find()

    //console.log(req.query.stream)
    res.status(200).send(
        {
            "total_streams": query.length,
            "user_streams": query
        }
    )
})

// get details from a stream --Passing
router.get('/:stream', async (req, res) => {
    var query = await Stream.findOne({ name: req.params.stream })
    var query_v = await Values.find({ stream_name: req.params.stream })
    console.log(query)
    if (query !== null) {
        res.status(200).send({
            "stream_name": req.params.stream,
            "created_at": query.creation || 0,
            "last_updated_at": query.lastUpdate || 0,
            "values": query_v.length || 0,
            "type": query.type,
            "mobile_stream": query.isMobile || false,
            "description": query.description || '',
            "periodicity": query.periodicity,
            "ttl": query.ttl
        })
    } else {
        res.status(404).send({
            "status": "Stream " + stream + " not found"
        })
    }
    console.log('stream:', stream)
    res.end()
})

// delete stream
router.delete('/', async (req, res) => {
    const stream_name = await Stream.findOneAndDelete(req.body.name)
    if (!stream_name) return res.status(404).send('The stream with the given name was not found');

    console.log(req)
    res.send({
        status: 'delete stream OK'
    })
})

// validate /values query string
function validateQueryGetDataString(stream){
    const schema = { stream         : Joi.string().min(4).required(),
                     interval_start : Joi.number(),
                     interval_end   : Joi.number()                
    }
    return Joi.validate(stream, schema)
}

// validate /list query string
function validateQueryGetStreamsString(stream){
    const schema = { interval_start : Joi.number(),
                     interval_end   : Joi.number()                
    }
    return Joi.validate(stream, schema)
}

// validate PUT / request body
function validatePutData(stream){
    const schema = { stream_name : Joi.string().min(4).required(),
                     values     : Joi.string().min(4).required(),
                     location   : Joi.array().items( Joi.number().required() , Joi.number().required())
    }
    return Joi.validate(stream, schema)
}

// validate POST / request body
function validateCreate(stream){
    const schema = { 
        name:        Joi.string().min(4).required(),
        type:        Joi.string().min(4).required(),
        description: Joi.string(),
        mobile: Joi.boolean(),
        periodicity: Joi.number().integer().positive(),
        ttl: Joi.number().integer().positive()
    }
    return Joi.validate(stream, schema)
}

module.exports = {
    router,
    Stream,
    Values
}