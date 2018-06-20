import * as expect from 'expect'
import * as Web3 from 'web3'
import * as Ganache from 'ganache-core'
import Authentication from './Authentication'
import Eth from './Eth'

let provider = Ganache.provider()
let web3 = new Web3(provider)
let eth = new Eth(web3)
let authentication = new Authentication(eth)

test('proveAddress and recoverAddress', async () => {
  let accounts = await eth.getAccounts()
  let address = accounts[0]
  let nonce = 'NONCE'
  let signature = await authentication.proveAddress(address, nonce)
  let recovered = await authentication.recoverAddress(address, nonce, signature)
  expect(recovered).toEqual(address)
})
