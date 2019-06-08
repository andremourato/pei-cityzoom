const express = require('express')
const alerts = require('../db/models/alerts')
const alertDebug = require('debug')('app:Alerts')
const axios = require('axios')
const config = require('config')
const {validateCreateAlert} = require('../validation')
const { validation } = require('../middleware')
const producer = require('../producer')

const router = new express.Router()

/* Contains all alert endpoints */
router.post('', validation(validateCreateAlert, 'body', 'Invalid alert'), async (req, res) => {
    const to_broker ={
        ...req.body,
        activations: [],
        active: false,
        created_at: Date.now()
    }
    console.log(to_broker)
    //Publishes the alert in the broker
    const wasPublished = await producer.publish('cityzoom/alerts',to_broker)
    if(!wasPublished){
        alertsDebug(`[Error] Alert ${to_broker.alert_ID} already exists`)
        return res.status(409).send({'Error':`Alert ${to_broker.alert_ID} already exists`}) 
    }
    res.status(200).send(to_broker)
})

//get all alerts
router.get('/list',async (req,res)=>{
    const values = await alerts.find({})
    res.send(values)
})

// dismiss alert
router.put('/:id', async (req,res) => {
    var exists = alerts.findOne({alert_ID: req.params.id})
    if (!exists) { return res.status(404).send({'Status':'Alert not found'})}
    await alerts.updateOne({alert_ID: req.params.id},{active:false})
    res.status(204).send()
})

//Read alert details
router.get('/:alert_id',async (req,res)=>{
    const doc = await alerts.findOne({alert_ID:req.params.alert_id})
    if (!doc) { return res.status(404).send({'Status':'Not Found'}) }

    res.status(200).send(doc)
})

//Get details from alerts related to stream
router.get('/streams/:stream_name',async (req,res)=>{
    const doc = await alerts.find({target_stream: req.params.stream_name})
    if (!doc) { return res.status(404).send({'Status':'Not Found'}) }

    res.status(200).send(doc)
})

router.get('/triggered', async (req, res) => {
    const start = req.query.interval_start ? req.query.interval_start : 0
    const compass = Number(Date.now())
    const end = req.query.interval_end ? req.query.interval_end : compass
    if (end < start || start < 0) {
        devicesDebug('[ERROR] Interval is wrong')
        return res.status(400).send({error: 'Bad interval defined'})
    }
    const doc = await alerts.find({active:true})
    res.status(200).send(doc)
})

module.exports = router
