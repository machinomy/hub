
import express = require('express')
import {Router} from "express-serve-static-core";
import Web3 = require('web3')
import Payment from 'machinomy/lib/Payment'
import mongo from 'machinomy/lib/mongo'
import Machinomy from 'machinomy'
import BigNumber from 'bignumber.js'
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
} 

export interface HubToken {
  meta: string,
  token: string
}

export default class PaymentService {
  machinomy: Machinomy

  constructor(receiver: string, ethereumAPI: string) {
    let web3 = new Web3(new Web3.providers.HttpProvider(ethereumAPI))
    this.machinomy = new Machinomy(receiver, web3, { engine: 'nedb', databaseFile: 'hub' })
  }

  async acceptPayment (metaPayment: MetaPayment): Promise <string> {
    let meta
    if (metaPayment.meta) {
      meta = metaPayment.meta.slice(0)
      delete metaPayment.meta
    }
    let payment = new Payment(metaPayment)
    let token = await this.machinomy.acceptPayment(payment)
    if (meta) {
      await this.insert({meta, token})
    }
    return token
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
      mongo.db().collection(COLLECTION).findOne(query, (err: Error, res: any) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  private insert (document: any): Promise<void> {
    return new Promise((resolve, reject) => {
      mongo.db().collection(COLLECTION).insert(document, (err: any, res: any) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
}