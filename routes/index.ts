import express = require('express')
import {Router} from "express-serve-static-core";
import {EngineMongo} from 'machinomy/lib/engines/engine'
import PaymentService from '../services/PaymentService'
import BigNumber from 'bignumber.js'
const router = express.Router()
require('dotenv').config()

const RECEIVER = process.env.RECEIVER
if (!RECEIVER) throw new Error('Please, set RECEIVER env variable')
const ETHEREUM_API = process.env.ETHEREUM_API
if (!ETHEREUM_API) throw new Error('Please, set ETHEREUM_API env variable')
let paymentService = new PaymentService(RECEIVER, ETHEREUM_API)

let engineMongo: EngineMongo = new EngineMongo()

engineMongo.connect().then(() => {
  router.post('/accept', async (req: express.Request, res: express.Response, next: Function) => {
    try {
      console.error(req.body)
      let token = await paymentService.acceptPayment(req.body.payment)
      console.log('INHUB TOKEN = ')
      console.log(token)
      res.status(202).header('Paywall-Token', token).send('Accepted').end()
    } catch(err) {
      console.error(err.message)
      res.status(403).send({ error: err.message })
    }
  })

  router.get('/verify', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let meta: string = req.query.meta
    let token: string = req.query.token
    let price: BigNumber = new BigNumber(req.query.price)
    try {
      let isOk = await paymentService.verify(meta, token, price)
      if (isOk) {
        res.status(200).send({ status: 'ok' })
      } else {
        res.status(403).send({ error: 'token is invalid' })
      }
    } catch(err) {
      res.status(403).send({ error: err.message })
    }
  })
});

router.get('/isalive', (req: express.Request, res: express.Response, next: express.NextFunction): any => {
  res.send('yes')
});

export {router}
