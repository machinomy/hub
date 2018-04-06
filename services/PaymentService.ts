
import express = require('express')
import {Router} from "express-serve-static-core";
import * as Web3 from 'web3'
import Payment from "machinomy/lib/payment";
import {PaymentJSON} from "machinomy/lib/payment";
import {EngineMongo} from 'machinomy/lib/engines/engine'
import Machinomy from 'machinomy'
import BigNumber from 'bignumber.js'
import {AcceptPaymentResponse} from 'machinomy/lib/client'
import Signature from 'machinomy/lib/signature'
const router = express.Router()
require('dotenv').config()

const COLLECTION = 'hub'

export interface MetaPayment {
  channelId: string
  sender: string
  receiver: string
  price: BigNumber
  value: BigNumber
  channelValue: BigNumber
  v: number
  r: string
  s: string
  contractAddress?: string
  meta: string
  token: string | undefined
}

export interface HubToken {
  meta: string,
  token: string
}

export default class PaymentService {
  machinomy: Machinomy
  engineMongo: EngineMongo

  constructor(receiver: string, ethereumAPI: string) {
    let web3 = new Web3(new Web3.providers.HttpProvider(ethereumAPI))
    this.machinomy = new Machinomy(receiver, web3, { engine: 'mongo', databaseFile: 'hub' })
    this.engineMongo = new EngineMongo()
  }

  async acceptPayment (inPayment: PaymentJSON): Promise <string> {
    let meta
    if (inPayment.meta) {
      meta = inPayment.meta.slice(0)
      delete inPayment.meta
    }
    let payment = {...inPayment, signature: Signature.fromParts({
        v: Number(inPayment.v),
        r: inPayment.r,
        s: inPayment.s
      })}
    let paymentResponse : AcceptPaymentResponse = await this.machinomy.acceptPayment({payment: payment})
    if (meta) {
      await this.insert({meta, token: paymentResponse.token})
    }
    return paymentResponse.token
  }

  async verify (meta: string, token: string, price: BigNumber): Promise<boolean> {
    let res = await this.findOne({meta, token})
    if (res) {
      let payment = await this.machinomy.paymentById(token)
      if (payment && payment.price.equals(price)) {
        return true
      }
    }
    return false
   }

  private findOne (query: any): Promise<HubToken> {
    return new Promise((resolve, reject) => {
      this.engineMongo.db().collection(COLLECTION).findOne(query, (err: Error, res: any) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  private insert (document: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.engineMongo.db().collection(COLLECTION).insert(document, (err: any, res: any) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
}
