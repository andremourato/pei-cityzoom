/*
 * API Endpoints:
 * create stream         -> localhost:8000/czb/stream (POST)  
 * post data to stream   -> localhost:8000/czb/stream (PUT)
 * read data from stream -> localhost:8000/czb/stream (GET)
 * list all streams      -> localhost:8000/czb/stream/list (GET)
 * delete stream         -> localhost:8000/czb/stream (DELETE)
 * 
 */
const {run,genDataCreationPayload}= require('./kafka-producer')
const create = require('./kafka-admin')
const prod = require('./kafka-producer')
const Joi = require('joi')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

const streamSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 256
    },
    description:{
        type: String,
        minlength: 5,
        maxlength: 200
    },
    mobile:{
        isMobile: Boolean,
    },
    type:{
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30
    },
    ttl:{
        type: Number,
         min: 10,
         max: 200
    },
    periodicity:{
        type: Number,
         min: 10,
         max: 200
    },
    timestamp: {
         type: Number
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
    stream_name:{
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
    },
    location: [latSchema]

})

const Stream = mongoose.model('Stream',streamSchema)
const Values = mongoose.model('Value',valueSchema)

router.post('/', async (req,res) => {
    const {error} = validateCreate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //temp
    var account = 'user_1'

    //kafka
    if (req.body.type !== 'temperature' && req.body.type !== 'pressure' && req.body.type !== 'waste' && req.body.type !== 'wind' && req.body.type !== )

    await create.createType(req.body.name)
    var payload = {
        name: req.body.name,
        description: req.body.description || '',
        mobile: req.body.mobile || false,
        type: 
    }
    const stream = new Stream(req.body)
    await stream.save()
   
    if( req.body.periodicity !=0){
        req.body.periodicity 
    }
    else {
        req.body.periodicity = 1200
    }
    
    res.send({
        status:'read data in stream OK' ,       
        name: req.body.name,
        account,
        periodicity:req.body.periodicity 
    })
    
})
//query string

router.get('/values', async (req,res) => {
  
    //const {error} = validateQueryString(req.body);
   // if(error) return res.status(400).send(error.details[0].message);

    const query = await Stream
        .find(req.query)
    //console.log(req.query) 
    res.send(
        console.log(query) 
    )
})

router.get('/', (req,res) => {
    //console.log(req.query)
    res.send({
        status: 'read data in stream OK'
    })
})

router.put('/',async (req,res) => {
    const {error} = validatePutData(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const stream_name = await Stream.findOne(req.body.name)

    if(!stream_name) return res.status(404).send('The stream with the given name was not found');
    
    var payload = prod.genDataCreationPayload('user_1', req.body.name, req.body.value, Number(new Date()), req.body.location)
    prod.run(payload)

    //console.log(req)
    res.send({
        status: 'put data in stream OK'
    })
})


router.delete('/', async (req, res) => {
    const stream_name = await Stream.findOneAndDelete(req.body.name)
    if(!stream_name) return res.status(404).send('The stream with the given name was not found');

    console.log(req)
    res.send({
        status: 'delete stream OK'
    })
})

function validateQueryString(strean){
    const schema = { stream_name : Joi.string().min(4).required(),
                     interval    : Joi.number()                
    }
    return Joi.validate(stream,schema) 
}

function validateDataStream(stream){
   const schema = { stream_name : Joi.string().min(4).required() }
   return Joi.validate(stream,schema) 
}
function validatePutData(stream){
    const schema = { stream_name : Joi.string().min(4).required(),
                     values     : Joi.string().min(4).required(),
                     location   : Joi.array().items( Joi.number().required() , Joi.number().required())
    }
    return Joi.validate(stream,schema)
}

function validateCreate(stream){
    const schema = { 
        name:        Joi.string().min(4).required(),
        type:        Joi.string().min(4).required(),
        description: Joi.string(),
        mobile:      Joi.boolean(),
        periodicity: Joi.number().integer().positive(),
        ttl:         Joi.number().integer().positive()
    }
    return Joi.validate(stream,schema)
}
module.exports = router