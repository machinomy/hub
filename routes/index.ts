import express = require('express')
// tslint:disable-next-line:no-unused-variable
import { Router } from 'express-serve-static-core'
import { default as Engine, EngineMongo, EnginePostgres, EngineSQLite } from 'machinomy/dist/lib/engines/engine'
import { default as PaymentService } from '../services/PaymentService'
import BigNumber from 'bignumber.js'
const router = express.Router()
require('dotenv').config()

const HUB_ADDRESS = process.env.HUB_ADDRESS
if (!HUB_ADDRESS) throw new Error('Please, set HUB_ADDRESS env variable')
const ETH_RPC_URL = process.env.ETH_RPC_URL
if (!ETH_RPC_URL) throw new Error('Please, set ETH_RPC_URL env variable')
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('Please, set DATABASE_URL env variable')
const TABLE_OR_COLLECTION_NAME = process.env.TABLE_OR_COLLECTION_NAME
if (!TABLE_OR_COLLECTION_NAME) throw new Error('Please, set TABLE_OR_COLLECTION_NAME env variable')

let dbEngine: Engine

// tslint:disable-next-line:no-unnecessary-type-assertion
const splits = DATABASE_URL!.split('://')

switch (splits[0]) {
  case 'mongodb': {
    // tslint:disable-next-line:no-unnecessary-type-assertion
    dbEngine = new EngineMongo(DATABASE_URL!)
    break
  }
  case 'postgresql': {
    // tslint:disable-next-line:no-unnecessary-type-assertion
    dbEngine = new EnginePostgres(DATABASE_URL!)
    break
  }
  case 'sqlite': {
    dbEngine = new EngineSQLite(splits[1])
    break
  }
  default:
    throw new Error(`Invalid engine: ${splits[0]}.`)
}

let paymentService: PaymentService = new PaymentService(HUB_ADDRESS, ETH_RPC_URL, dbEngine, DATABASE_URL, TABLE_OR_COLLECTION_NAME)

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
