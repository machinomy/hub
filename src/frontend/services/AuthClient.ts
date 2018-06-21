import Eth from '../../support/Eth'
import Backend from './Backend'
import Authentication from '../../support/Authentication'
import Address from '../../domain/Address';

export default class AuthClient {
  backend: Backend

  constructor (backend: Backend) {
    this.backend = backend
  }

  async authenticate (eth: Eth): Promise<Address> {
    let address = await eth.firstAccount()
    if (!address) throw new Error('No address found to authenticate against')

    let nonce = await this.backend.auth.getChallenge(address)
    let authentication = await this.authentication(eth)
    let signature = await authentication.proveAddress(address, nonce)
    let isAccepted = await this.backend.auth.postChallenge(address, nonce, signature)
    if (isAccepted) {
      return address
    } else {
      throw new Error('Challenge response rejected')
    }
  }

  async identify (): Promise<Address | null> {
    return await this.backend.auth.getMe()
  }

  async authentication (eth: Eth) {
    return new Authentication(eth)
  }
}
