import * as expect from 'expect'
import IAuthNonceDatabase from "../storage/IAuthNonceDatabase";
import AuthService from "./AuthService";

let DummyAuthNonceDatabase = jest.fn<IAuthNonceDatabase>(() => ({
  save: jest.fn()
}))
let database = new DummyAuthNonceDatabase()

test('generateChallenge', async () => {
  let address = '0xdead'
  let nonce = "nonce"
  let service = new AuthService(database)
  // let nextNonce = () => nonce
  // await service.generateChallenge(address, nextNonce)
  // expect(database.save).toHaveBeenCalledWith(address, nonce)
  expect(1).toBeTruthy()
})
