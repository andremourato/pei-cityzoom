const { Kafka , logLevel} = require('kafkajs')

const localhost = process.env.HOST || '127.0.0.1'

// logger
const fixedLogs = logLevel => ({ namespace, level, label, log }) => {
    const { timestamp, logger, message, ...others } = log 
    console.log(`[${timestamp}] ${label} [${namespace}]: ${message} Failure: ${others.error}`)
}

const kafka = new Kafka({
  brokers: [`${localhost}:9090`, `${localhost}:9091`, `${localhost}:9092`, `${localhost}:9093`, `${localhost}:9094` ],
  logLevel: logLevel.ERROR,
  logCreator: fixedLogs
})

// ------------------ Useful comments to help as guide ------------------------------
// const topic = 'temp'
// const producer = kafka.producer()
// 
// const getRandomNumber = () => Math.round(Math.random()*10)
// const createMessage = num => ({
//   key: `key-${num}`,
//   value: `value-${num}-${new Date().toISOString()}`,
// })
// 
// const sendMessage = () => {
//   return producer
//     .send({
//       topic,
//       timeout: 1000,
//       messages: Array(getRandomNumber())
//         .fill()
//         .map(_ => createMessage(getRandomNumber())),
//     })
//     .then(e => {
//         console.log(e)
//         process.exit(0)
//     })
//     .catch(e => console.error(`[example/producer] ${e.message}`, e))
// }
// 
// const run = async () => {
//   await producer.connect()
//   sendMessage()
// }
// 
// run().catch(e => console.error(`[example/producer] ${e.message}`, e))
// 
// const errorTypes = ['unhandledRejection', 'uncaughtException']
// const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']
// 
// errorTypes.map(type => {
//   process.on(type, async () => {
//     try {
//       console.log(`process.on ${type}`)
//       await producer.disconnect()
//       process.exit(0)
//     } catch (_) {
//       process.exit(1)
//     }
//   })
// })
// 
// signalTraps.map(type => {
//   process.once(type, async () => {
//     try {
//       await producer.disconnect()
//     } finally {
//       process.kill(process.pid, type)
//     }
//   })
// })

const producer = kafka.producer()

const pushData = async payload => {
  return producer.send(payload)
                 .then( e=> {
                    console.log('Data sent: ', e)
                    process.exit(0)
                 })
                 .catch(e => console.log('Error pushing data to kafka broker:\n', e))
}


// run ({String topic, {String key, JSON value[]} messages} payload)
const run = async payload => {
  console.log('Connecting to kafka server...')
  await producer.connect()
  pushData(payload).catch(e => console.error(JSON.parse(e)))
  await producer.disconnect()
}

// test payload
const payload = {
  acks: 1,
  timeout: 1000,
  topic: 'temp',
  messages: [
    {
        key: 'con',
        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key0'}),
    },
//    {
//        key: 'key1',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key1'}),
//    },
//    {
//        key: 'key2',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key2'}),
//    },
//    {
//        key: 'key3',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key3'}),
//    },
//    {
//        key: 'key4',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key4'}),
//    },
//    {
//        key: 'key5',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key5'}),
//    },
//    {
//        key: 'key6',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key6'}),
//    },
//    {
//        key: 'key7',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key7'}),
//    },
//    {
//        key: 'key8',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key8'}),
//    },
//    {
//        key: 'key9',
//        value: JSON.stringify({data: 'This message is in JSON data-type', key: 'key9'}),
//    }
  ]
}

run(payload).catch(e => console.error(JSON.parse(e)))



module.exports = {
    run,
    payload
}// 