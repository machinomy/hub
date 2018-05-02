import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { default as PaymentService } from '../services/PaymentService'
import { EngineMongo } from 'machinomy/dist/lib/engines/engine'
import { PaymentJSON } from 'machinomy/dist/lib/payment'

require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('Please, set DATABASE_URL env variable')
const TABLE_OR_COLLECTION_NAME = process.env.TABLE_OR_COLLECTION_NAME
if (!TABLE_OR_COLLECTION_NAME) throw new Error('Please, set TABLE_OR_COLLECTION_NAME env variable')

let paymentObj: PaymentJSON = {
  channelId: 'string',
  sender: 'string',
  receiver: 'string',
  price: new BigNumber(1),
  value: new BigNumber(5),
  channelValue: new BigNumber(10),
  v: 1,
  r: 'string',
  s: 'string',
  meta: 'meta_string',
  token: undefined
}

let engineMongo: EngineMongo = new EngineMongo('mongodb://localhost:27017/hub')

describe('.PaymentService', () => {
  before((done) => {
    engineMongo.connect().then(() => {
      done()
    }).catch((e: Error) => {
      console.log(e)
    })
  })

  beforeEach((done) => {
    engineMongo.drop().then(() => {
      done()
    })
  })

  after((done) => {
    engineMongo.close().then(() => {
      done()
    })
  })

  describe('.verifyToken', () => {
    let payment: PaymentJSON
    let paymentService: PaymentService
    let meta: string

    beforeEach(() => {
      payment = Object.assign({}, paymentObj)
      paymentService = new PaymentService('string', 'address', engineMongo, DATABASE_URL, TABLE_OR_COLLECTION_NAME)
      meta = payment.meta.slice(0)
    })

    it('returns true if token correct and price are correct', async () => {
      let token = await paymentService.acceptPayment(payment)
      let verified = await paymentService.verify(meta, token, payment.price)
      expect(verified).to.equal(true)
    })

    it('returns false if token incorrect', async () => {
      await paymentService.acceptPayment(payment)
      let verified = await paymentService.verify(meta, 'wrongtoken', payment.price)
      expect(verified).to.equal(false)
    })

    it('returns false if price incorrect', async () => {
      let token = await paymentService.acceptPayment(payment)
      let verified = await paymentService.verify(meta, token, new BigNumber(100))
      expect(verified).to.equal(false)
    })
  })
})
