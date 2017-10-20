import * as express from 'express'
export let router = express.Router()

import Web3 = require('web3')
import Payment from 'machinomy/lib/Payment'
import * as configuration from 'machinomy/lib/configuration'
import mongo from 'machinomy/lib/mongo'
import Machinomy from 'machinomy'

let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
let settings = configuration.receiver()
// web3.personal.unlockAccount(settings.account, settings.password, 1000)
let machinomy = new Machinomy(settings.account, web3, { engine: 'mongo' })

mongo.connectToServer().then(() => {
  router.post('/machinomy', async (req: express.Request, res: express.Response, next: Function) => {
    let payment = new Payment(req.body)
    let token = await machinomy.acceptPayment(payment)
    res.status(202).header('Paywall-Token', token).send('Accepted').end()
  })

  router.get('/verify', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let token: string = req.body.token
    let isOk = false
    isOk = await machinomy.verifyToken(token)
    if (isOk) {
      res.status(200).send({ status: 'ok' })
    } else {
      res.status(403).send({ status: 'token is invalid' })
    }
  })
});

router.get('/isalive', (req: express.Request, res: express.Response, next: express.NextFunction): any => {
  res.send('yes')
});
