import express = require('express')
// tslint:disable-next-line:no-unused-variable
import { Router } from 'express-serve-static-core'
import { default as Engine, EngineSQLite } from 'machinomy/dist/lib/engines/engine'
import { default as PaymentService } from '../services/PaymentService'
import BigNumber from 'bignumber.js'
const router = express.Router()
require('dotenv').config()

const RECEIVER = process.env.RECEIVER
if (!RECEIVER) throw new Error('Please, set RECEIVER env variable')
const ETHEREUM_API = process.env.ETHEREUM_API
if (!ETHEREUM_API) throw new Error('Please, set ETHEREUM_API env variable')

let dbEngine: Engine = new EngineSQLite('sqlite://hub.sqlite')
let paymentService: PaymentService = new PaymentService(RECEIVER, ETHEREUM_API, dbEngine, 'hub')

dbEngine.connect().then(() => {
  router.post('/accept', async (req: express.Request, res: express.Response, next: Function) => {
    try {
      let token = await paymentService.acceptPayment(req.body.payment)
      res.status(202).header('Paywall-Token', token).send({ token: token }).end()
    } catch (err) {
      console.error(err.message)
      res.status(403).send({ error: err })
    }
  })

  router.head('/accept', (req: express.Request, res: express.Response, next: express.NextFunction): any => {
    res.send()
  })

  router.get('/verify', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.query.meta === undefined) {
      res.status(403).send({ error: 'meta is invalid' })
    } else if (req.query.token === undefined) {
      res.status(403).send({ error: 'token is invalid' })
    } else if (req.query.price === undefined) {
      res.status(403).send({ error: 'price is invalid' })
    } else {
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
      } catch (err) {
        res.status(403).send({ error: err })
      }
    }
  })
})

export { router }
