import IAuthService from './IAuthService'
import Address from '../domain/Address'
import AuthNonce from '../domain/AuthNonce'
import HexString from '../domain/HexString'
import IAuthNonceDatabase from '../storage/IAuthNonceDatabase'
import * as uuid from 'uuid'

function uuidNonce () {
  return uuid.v4()
}

export default class AuthService implements IAuthService {
  database: IAuthNonceDatabase

  constructor (database: IAuthNonceDatabase) {
    this.database = database
  }

  async generateChallenge(address: Address, nextNonce: () => string = uuidNonce): Promise<AuthNonce> {
    let nonce = nextNonce()
    await this.database.save(address, nonce)
    return nonce
  }

  async acceptChallenge (address: Address, nonce: AuthNonce, signature: HexString): Promise<boolean> {
    // let nonce = await this.database.retrieve(address, nonce)

    return true
    // const creation = this.nonces[nonce]
    //
    // if (!creation) {
    //   LOG.warn(`Nonce ${nonce} not found.`)
    //   return null
    // }
    //
    // const hash = this.sha3(`${MemoryCRAuthManager.HASH_PREAMBLE} ${this.sha3(nonce)} ${this.sha3(origin)}`)
    // const sigAddr = this.extractAddress(hash, signature)
    //
    // if (!sigAddr || sigAddr !== address) {
    //   LOG.warn(`Received invalid signature. Expected address: ${address}. Got address: ${sigAddr}.`)
    //   return null
    // }
    //
    // if (Date.now() - creation > CHALLENGE_EXPIRY_MS) {
    //   LOG.warn(`Nonce for address ${sigAddr} is expired.`)
    //   return null
    // }
    //
    // delete this.nonces[nonce]
    //
    // return sigAddr
  }
}
