import * as expect from 'expect'
import AuthClient from './AuthClient';
import Backend from './Backend';
import Eth from '../../support/Eth';
import IAuthentication from '../../support/IAuthentication';

const ADDRESS = 'ADDRESS'
const NONCE = 'NONCE'
const SIGNATURE = 'SIGNATURE'

let DummyEth = jest.fn<Eth>(() => ({
  firstAccount: jest.fn(() => Promise.resolve(ADDRESS))
}))
let eth = new DummyEth()

function dummyClient(accept: boolean, identified: boolean = true) {
  let postChallengeResult = accept ? Promise.resolve(ADDRESS) : Promise.reject(new Error())

  let DummyBackend = jest.fn<Backend>(() => ({
    auth: {
      getChallenge: jest.fn(async () => NONCE),
      postChallenge: jest.fn(async () => postChallengeResult),
      getMe: jest.fn(async () => identified ? ADDRESS : null)
    }
  }))
  let backend = new DummyBackend()
  let client = new AuthClient(backend)

  let Authentication = jest.fn<IAuthentication>(() => ({
    proveAddress: jest.fn(async () => SIGNATURE)
  }))
  let authentication = new Authentication()
  jest.spyOn(client, 'authentication').mockReturnValue(authentication)

  return { client, backend, authentication }
}


describe('authenticate', () => {
  test('accept', async () => {
    let { client, backend, authentication } = dummyClient(true)
    let result = await client.authenticate(eth)
    expect(result).toEqual(ADDRESS)
    expect(eth.firstAccount).toHaveBeenCalled()
    expect(backend.auth.getChallenge).toHaveBeenCalledWith(ADDRESS)
    expect(authentication.proveAddress).toHaveBeenCalledWith(ADDRESS, NONCE)
    expect(backend.auth.postChallenge).toHaveBeenCalledWith(ADDRESS, NONCE, SIGNATURE)
  })

  test('reject', async () => {
    let { client, backend, authentication } = dummyClient(false)
    try {
      let result = await client.authenticate(eth)
      expect(result).toEqual('IMPOSSIBLE')
    } catch (e) {
      expect(e).toBeTruthy()
    }
    expect(eth.firstAccount).toHaveBeenCalled()
    expect(backend.auth.getChallenge).toHaveBeenCalledWith(ADDRESS)
    expect(authentication.proveAddress).toHaveBeenCalledWith(ADDRESS, NONCE)
    expect(backend.auth.postChallenge).toHaveBeenCalledWith(ADDRESS, NONCE, SIGNATURE)
  })
})

describe('identify', () => {
  test('accept', async () => {
    let { client, backend } = dummyClient(true, true)
    let result = await client.identify()
    expect(result).toEqual(ADDRESS)
    expect(backend.auth.getMe).toHaveBeenCalledWith()
  })

  test('reject', async () => {
    let { client, backend } = dummyClient(true, false)
    let result = await client.identify()
    expect(result).toEqual(null)
    expect(backend.auth.getMe).toHaveBeenCalledWith()
  })
})

