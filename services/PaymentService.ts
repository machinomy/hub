import * as Web3 from 'web3'
import Machinomy from 'machinomy'
import BigNumber from 'bignumber.js'
import Signature from 'machinomy/dist/lib/signature'
import { default as pify } from 'machinomy/dist/lib/util/pify'
import { PaymentJSON } from 'machinomy/dist/lib/payment'
import { default as Engine, EnginePostgres, EngineSQLite } from 'machinomy/dist/lib/engines/engine'
import { AcceptPaymentResponse } from 'machinomy/dist/lib/accept_payment_response'

export interface HubToken {
  meta: string
  token: string
}

export default class PaymentService {
  machinomy: Machinomy
  engine: Engine
  tableOrCollectionName: string

  constructor (receiver: string, ethereumAPI: string, dbEngine: Engine, databaseUrl: string, tableOrCollectionName: string) {
    let web3: Web3 = new Web3(new Web3.providers.HttpProvider(ethereumAPI))
    this.machinomy = new Machinomy(receiver, web3, { databaseUrl: databaseUrl })
    this.engine = dbEngine
    this.tableOrCollectionName = tableOrCollectionName
    this.ensureTableExists()
  }

  ensureTableExists (): Promise<any> {
    return this.engine.exec((client: any) => pify((cb: Function) => {
      if (this.engine instanceof EnginePostgres) {
        return client.query(`CREATE TABLE IF NOT EXISTS ${this.tableOrCollectionName} (token TEXT, meta TEXT)`, cb)
      } else if (this.engine instanceof EngineSQLite) {
        return client.run(`CREATE TABLE IF NOT EXISTS ${this.tableOrCollectionName} (token TEXT, meta TEXT)`, cb)
      }
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
      return this.engine.findOne!(query, this.tableOrCollectionName).then((resp: any) => {
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
      return this.engine.insert!(document, this.tableOrCollectionName).then((doc: any) => {
        if (!doc) {
          reject('Empty document')
          return
        }
        resolve()
      })
    })
  }
}
