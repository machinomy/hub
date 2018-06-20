import AuthNonce from '../domain/AuthNonce'
import Address from '../domain/Address'
import * as validate from 'validate.js'

import IAuthNonceDatabase from './IAuthNonceDatabase'
import { RedisClient } from 'redis'

function authKey (address: Address, nonce: AuthNonce) {
  return `auth:${address}:${nonce}`
}

const TTL = 60 * 10 // 10 minutes in seconds

export default class AuthNonceDatabase implements IAuthNonceDatabase {
  nonces: Map<AuthNonce, Date>
  client: RedisClient

  constructor (redisClient: RedisClient) {
    this.nonces = new Map()
    this.client = redisClient
  }

  async save (address: Address, nonce: AuthNonce): Promise<void> {
    let key = authKey(address, nonce)
    await this.set(key, nonce)
    await this.expire(key)
  }

  async isPresent (address: Address, nonce: AuthNonce): Promise<boolean> {
    let key = authKey(address, nonce)
    let retrieved = await this.get(key)
    return validate.isDefined(retrieved)
  }

  private async get (key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client.get(key, (err, result) => {
        err ? reject(err) : resolve(result)
      })
    })
  }

  private async expire (key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.expire(key, TTL, err => {
        err ? reject(err) : resolve()
      })
    })
  }

  private async set (key: string, value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.set(key, value, err => {
        err ? reject(err) : resolve()
      })
    })
  }
}
