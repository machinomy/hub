import * as Web3 from 'web3'
import Machinomy from 'machinomy'
import BigNumber from 'bignumber.js'
import Signature from 'machinomy/dist/lib/signature'
import { default as pify } from 'machinomy/dist/lib/util/pify'
import { PaymentJSON } from 'machinomy/dist/lib/payment'
import { EngineMongo } from 'machinomy/dist/lib/engines/engine'
import { AcceptPaymentResponse } from 'machinomy/dist/lib/client'

require('dotenv').config()

export const COLLECTION = 'hub'

export interface HubToken {
  meta: string
  token: string
}

export default class PaymentService {
  machinomy: Machinomy
  engineMongo: EngineMongo

  constructor (receiver: string, ethereumAPI: string) {
    let web3: Web3 = new Web3(new Web3.providers.HttpProvider(ethereumAPI))
    this.machinomy = new Machinomy(receiver, web3, { databaseUrl: 'mongodb://localhost:27017/' + COLLECTION })
    this.engineMongo = new EngineMongo('mongodb://localhost:27017/' + COLLECTION)
  }

  async acceptPayment (inPayment: PaymentJSON): Promise <string> {
    await this.engineMongo.connect()
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
      await this.insert({ meta, token: paymentResponse.token })
    }
    return new Promise<string>((resolve, reject) => { paymentResponse ? resolve(paymentResponse.token) : reject('') })
  }

  async verify (meta: string, token: string, price: BigNumber): Promise<boolean> {
    if (token && token !== 'undefined') {
      await this.engineMongo.connect()
      let res = await this.findOne({ meta, token })
      if (res) {
        let payment = await this.machinomy.paymentById(token)
        if (payment && payment.price.equals(price)) {
          return new Promise<boolean>(resolve => resolve(true))
        }
      }
    }
    return new Promise<boolean>(resolve => resolve(false))
  }

  private findOne (query: any): Promise<HubToken> {
    return new Promise<HubToken>((resolve, reject) => {
      return this.engineMongo.exec((client: any) => {
        return pify((cb: Function) => client.collection(COLLECTION).findOne(query, cb))
      }).then((doc: any) => {
        if (!doc) {
          reject('Empty document')
        }
        resolve({ token: doc['token'], meta: doc['meta'] } as HubToken)
      })
    })
  }

  private insert (document: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.engineMongo.exec((client: any) => {
        return pify((cb: Function) => client.collection(COLLECTION).insert(document, cb))
      }).then((doc: any) => {
        if (!doc) {
          reject('Empty document')
        }
        resolve()
      })
    })
  }
}
