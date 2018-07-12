import * as Web3 from 'web3'
import HexString from '../domain/HexString'
import Address from '../domain/Address'

export default class Eth {
  web3: Web3

  constructor (web3: Web3) {
    this.web3 = web3
  }

  static async fromProvider (provider: Web3.Provider): Promise<Eth> {
    let web3 = new Web3(provider)
    return new Eth(web3)
  }

  async firstAccount (): Promise<string | null> {
    let accounts = await this.getAccounts()
    return accounts[0]
  }

  async getAccounts (): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        err ? reject(err) : resolve(accounts)
      })
    })
  }

  async isConnected (): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.web3.currentProvider.sendAsync({
        id: 9999999999,
        jsonrpc: '2.0',
        method: 'net_listening',
        params: []
      }, err => {
        err ? resolve(false) : resolve(true)
      })
      setTimeout(() => {
        resolve(false)
      }, 1000)
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
