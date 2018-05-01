import * as Web3 from 'web3'
import Machinomy from 'machinomy'
import BigNumber from 'bignumber.js'
import Signature from 'machinomy/dist/lib/signature'
import { default as pify } from 'machinomy/dist/lib/util/pify'
import { PaymentJSON } from 'machinomy/dist/lib/payment'
import { default as Engine } from 'machinomy/dist/lib/engines/engine'
import { AcceptPaymentResponse } from 'machinomy/dist/lib/client'

require('dotenv').config()

export interface HubToken {
  meta: string
  token: string
}

export default class PaymentService {
  machinomy: Machinomy
  engine: Engine
  collectionOrTableName: string

  constructor (receiver: string, ethereumAPI: string, dbEngine: Engine, collectionOrTableName: string) {
    let web3: Web3 = new Web3(new Web3.providers.HttpProvider(ethereumAPI))
    // Uncomment below for SQLite
    // this.machinomy = new Machinomy(receiver, web3, { databaseUrl: 'sqlite://hub.sqlite' })
    this.machinomy = new Machinomy(receiver, web3, { databaseUrl: 'postgresql://paymenthub:1@localhost/PaymentHub' })
    this.engine = dbEngine
    this.collectionOrTableName = collectionOrTableName ? collectionOrTableName : 'paymentService'
    this.ensureDBExists()
  }

  ensureDBExists (): Promise<any> {
    return this.engine.exec((client: any) => pify((cb: Function) => {
      // Uncomment below for SQLite
      // return client.run(`CREATE TABLE IF NOT EXISTS ${this.collectionOrTableName} (token TEXT, meta TEXT)`, cb)
      return client.query(`CREATE TABLE IF NOT EXISTS ${this.collectionOrTableName} (token TEXT, meta TEXT)`, cb)
    }))
  }

  acceptPayment (inPayment: PaymentJSON): Promise <string> {
    return this.engine.connect().then(async () => {
      let meta = ''
      if (inPayment.meta) {
        meta = inPayment.meta.slice(0)
        delete inPayment.meta
      }
      let payment = { ...inPayment, signature: Signature.fromParts({
        v: Number(inPayment.v),
        r: inPayment.r,
        s: inPayment.s
      }), value: new BigNumber(inPayment.value), price: new BigNumber(inPayment.price) }

      let paymentResponse: AcceptPaymentResponse = await this.machinomy.acceptPayment({ payment: payment })
      if (meta) {
        await this.insert({ meta: meta, token: paymentResponse.token })
      }
      return new Promise<string>((resolve, reject) => { paymentResponse ? resolve(paymentResponse.token) : reject('') })
    })

  }

  verify (meta: string, token: string, price: BigNumber): Promise<boolean> {
    return this.engine.connect().then(async () => {
      if (token && token !== 'undefined') {
        let res = await this.findOne({ meta: meta, token: token })
        if (res) {
          let payment = await this.machinomy.paymentById(token)
          if (payment && payment.price.equals(price)) {
            return Promise.resolve(true)
          }
        }
      }
      return Promise.resolve(false)
    })
  }

  private findOne (query: any): Promise<HubToken> {
    return new Promise<HubToken>((resolve, reject) => {
      return this.engine.findOne!(query, this.collectionOrTableName).then((resp: any) => {
        if (!resp) {
          reject({})
          return
        }
        resolve({ token: resp['token'], meta: resp['meta'] } as HubToken)
      })
    })
  }

  private insert (document: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.engine.insert!(document, this.collectionOrTableName).then((doc: any) => {
        if (!doc) {
          reject('Empty document')
          return
        }
        resolve()
      })
    })
  }
}
