import * as expect from 'expect'
import IAuthNonceDatabase from '../storage/IAuthNonceDatabase'
import AuthService from './AuthService'
import IAuthentication from '../support/IAuthentication'

const ADDRESS = '0xdead'
const NONCE = 'NONCE'

test('challenge', async () => {
  const Authentication = jest.fn<IAuthentication>()
  const AuthNonceDatabase = jest.fn<IAuthNonceDatabase>(() => ({
    save: jest.fn()
  }))

  const database = new AuthNonceDatabase()
  const authService = new AuthService(database, new Authentication())

  let token = await authService.challenge(ADDRESS)
  expect(database.save).toHaveBeenCalledWith(ADDRESS, token)
})

describe('canAccept', () => {
  test('true for valid token', async () => {
    let signature = '0xsignature'

    const Authentication = jest.fn<IAuthentication>(() => ({
      recoverAddress: jest.fn(async () => ADDRESS)
    }))
    const AuthNonceDatabase = jest.fn<IAuthNonceDatabase>(() => ({
      isPresent: jest.fn(async () => true)
    }))

    const authService = new AuthService(new AuthNonceDatabase(), new Authentication())

    let canAccept = await authService.canAccept(ADDRESS, NONCE, signature)
    expect(canAccept).toBeTruthy()
  })

  test('false for not found token', async () => {
    let signature = '0xsignature'

    const Authentication = jest.fn<IAuthentication>()
    const AuthNonceDatabase = jest.fn<IAuthNonceDatabase>(() => ({
      isPresent: jest.fn(async () => false)
    }))

    const authService = new AuthService(new AuthNonceDatabase(), new Authentication())

    let canAccept = await authService.canAccept(ADDRESS, NONCE, signature)
    expect(canAccept).toBeFalsy()
  })

  test('false for invalid signature', async () => {
    let signature = '0xsignature'

    const Authentication = jest.fn<IAuthentication>(() => ({
      recoverAddress: jest.fn(async () => 'WRONG')
    }))
    const AuthNonceDatabase = jest.fn<IAuthNonceDatabase>(() => ({
      isPresent: jest.fn(async () => true)
    }))

    const authService = new AuthService(new AuthNonceDatabase(), new Authentication())

    let canAccept = await authService.canAccept(ADDRESS, NONCE, signature)
    expect(canAccept).toBeFalsy()
  })
})
