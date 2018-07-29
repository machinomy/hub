import IAuthService from './IAuthService'
import Address from '../domain/Address'
import AuthNonce from '../domain/AuthNonce'
import HexString from '../domain/HexString'
import IAuthNonceDatabase from '../storage/IAuthNonceDatabase'
import * as uuid from 'uuid'
import Logger from '@machinomy/logger'
import IAuthentication from '../support/IAuthentication'

const log = new Logger('service:auth')

function uuidNonce () {
  return uuid.v4()
}

export default class AuthService implements IAuthService {
  database: IAuthNonceDatabase
  authentication: IAuthentication

  constructor (database: IAuthNonceDatabase, authentication: IAuthentication) {
    this.database = database
    this.authentication = authentication
  }

  async challenge (address: Address, nextNonce: () => string = uuidNonce): Promise<AuthNonce> {
    let nonce = nextNonce()
    log.debug(`Generate nonce ${nonce} for ${address}`)
    await this.database.save(address, nonce)
    return nonce
  }

  async canAccept (address: Address, nonce: AuthNonce, signature: HexString): Promise<boolean> {
    let isPresent = await this.database.isPresent(address, nonce)
    if (isPresent) {
      let recovered = await this.authentication.recoverAddress(address, nonce, signature)
      let canAccept = address === recovered
      if (!canAccept) log.info(`Wrong challenge response for ${address}, recovered address is ${recovered}`)
      return canAccept
    } else {
      log.info(`Nonce ${nonce} for address ${address} not found`)
      return false
    }
  }
}
