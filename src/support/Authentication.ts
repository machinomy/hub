import HexString from '../domain/HexString'
import Address from '../domain/Address'
import * as util from 'ethereumjs-util'
import AuthNonce from '../domain/AuthNonce'
import { Buffer } from 'safe-buffer'
import Eth from './Eth'
import IAuthentication from './IAuthentication'

const HASH_PREAMBLE = 'Machinomy authentication message:'
const ETH_PREAMBLE = '\x19Ethereum Signed Message:\n'

export default class Authentication implements IAuthentication {
  eth: Eth

  constructor (eth: Eth) {
    this.eth = eth
  }

  /**
   * Return signature for nonce.
   */
  async proveAddress (address: Address, nonce: AuthNonce): Promise<HexString> {
    let hash = await this.toHash(nonce)
    return this.eth.sign(address, hash)
  }

  async recoverAddress (address: Address, nonce: AuthNonce, signature: HexString): Promise<Address> {
    const hash = await this.toHash(nonce)
    const buffer = util.toBuffer(hash)

    const sig = util.fromRpcSig(signature)
    const prefix = new Buffer(ETH_PREAMBLE)
    const msg = util.sha3(
      Buffer.concat([prefix, new Buffer(String(buffer.length)), buffer])
    )

    const publicKey = util.ecrecover(msg, sig.v, sig.r, sig.s)
    const recoveredAddress = util.publicToAddress(publicKey)
    return util.bufferToHex(recoveredAddress)
  }

  protected async toHash (nonce: AuthNonce): Promise<HexString> {
    return this.eth.sha3(`${HASH_PREAMBLE} ${this.eth.sha3(nonce)}`)
  }
}
