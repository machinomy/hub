
import express = require('express')
import {Router} from "express-serve-static-core";
import * as Web3 from 'web3'
import Payment from "machinomy/dist/lib/payment";
import {default as pify} from "machinomy/dist/lib/util/pify"
import {PaymentJSON} from "machinomy/dist/lib/payment"
import {EngineMongo} from 'machinomy/dist/lib/engines/engine'
import Machinomy from 'machinomy'
import BigNumber from 'bignumber.js'
import {AcceptPaymentResponse} from 'machinomy/dist/lib/client'
import Signature from 'machinomy/dist/lib/signature'
const  ethutils = require( 'ethereumjs-util')
const router = express.Router()

require('dotenv').config()

export const COLLECTION = 'hub'

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
    this.machinomy = new Machinomy(receiver, web3, { databaseUrl: 'mongodb://localhost:27017/' + COLLECTION})
    this.engineMongo = new EngineMongo('mongodb://localhost:27017/' + COLLECTION)
  }

  async acceptPayment (inPayment: PaymentJSON): Promise <string> {
    await this.engineMongo.connect()
    let meta
    if (inPayment.meta) {
      meta = inPayment.meta.slice(0)
      delete inPayment.meta
    }
    let payment = {...inPayment, signature: Signature.fromParts({
        v: Number(inPayment.v),
        r: inPayment.r,
        s: inPayment.s
      }), value: new BigNumber(inPayment.value), price: new BigNumber(inPayment.price)}
    // console.log('VYNOS RSV:')
    // console.log('r: '+inPayment.r)
    // console.log('s: '+inPayment.s)
    //   console.log('v: '+inPayment.v)

    // let msghash = ethutils.sha3("\x19Ethereum Signed Message:\n32"+ethutils.sha3("0x2c2b9c9a4a25e24b174f26114e8926a9f2128fe4"+inPayment.channelId.substring(2)+inPayment.value))
    // let addressHex = ethutils.pubToAddress(ethutils.ecrecover(msghash, inPayment.v, inPayment.r, inPayment.s))
    // console.log('Substring:'+inPayment.channelId.substring(2))
    // console.log(addressHex)
    // console.log('HEX ADDR = '+ ethutils.bufferToHex(addressHex))
    let paymentResponse : AcceptPaymentResponse = await this.machinomy.acceptPayment({payment: payment})
    if (meta) {
      await this.insert({meta, token: paymentResponse.token})
    }
    return new Promise<string>((resolve, reject) => {paymentResponse ? resolve(paymentResponse.token) : reject('')})
  }

  async verify (meta: string, token: string, price: BigNumber): Promise<boolean> {
    if (token && token !== 'undefined') {
      await this.engineMongo.connect()
      let res = await this.findOne({meta, token})
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
        resolve({token: doc['token'], meta: doc['meta']} as HubToken)
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
