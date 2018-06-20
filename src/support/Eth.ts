import * as Web3 from 'web3'
import HexString from '../domain/HexString'
import Address from '../domain/Address'

export default class Eth {
  web3: Web3

  constructor (web3: Web3) {
    this.web3 = web3
  }

  async getAccounts (): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        err ? reject(err) : resolve(accounts)
      })
    })
  }

  async sha3 (text: HexString): Promise<HexString> {
    return this.web3.sha3(text)
  }

  async sign (address: Address, data: HexString): Promise<HexString> {
    return new Promise<HexString>((resolve, reject) => {
      this.web3.eth.sign(address, data, (err, signature) => {
        err ? reject(err) : resolve(signature)
      })
    })
  }
}
