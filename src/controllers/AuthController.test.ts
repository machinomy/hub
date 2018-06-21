import * as request from 'supertest'
import * as Koa from 'koa'
import AuthController from './AuthController'
import IAuthService from '../services/IAuthService'
import * as session from 'koa-session'
import * as bodyParser from 'koa-bodyparser'

const ADDRESS = '0xADDRESS'
const nonce = async (address: string) => `NONCE FOR ${address}`

describe('GET /challenge', () => {
  test('return nonce', async () => {
    const app = new Koa()
    const AuthService = jest.fn<IAuthService>(() => ({
      challenge: nonce
    }))

    const authController = new AuthController(new AuthService())
    app.use(authController.middleware)

    const response = await request(app.callback()).get('/challenge').query({ address: ADDRESS })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ nonce: await nonce(ADDRESS) })
  })
})

describe('POST /challenge', () => {
  test('accept', async () => {
    const app = new Koa()
    const AuthService = jest.fn<IAuthService>(() => ({
      canAccept: jest.fn(async (address, nonce, signature) => true)
    }))

    const authController = new AuthController(new AuthService())
    app.keys = [ 'SECRET' ]
    app.use(session(app))
    app.use(bodyParser())
    app.use(authController.middleware)

    const response = await request(app.callback()).post('/challenge').send({
      address: ADDRESS,
      nonce: await nonce(ADDRESS),
      signature: 'SIGNATURE'
    })

    expect(response.ok).toBe(true)
    expect(response.body).toEqual({ isAccepted: true })

    const cookie = response.header['set-cookie']
    expect(cookie).toHaveLength(1)
    expect(cookie[0]).toBeTruthy()
  })

  test('not accept', async () => {
    const app = new Koa()
    const AuthService = jest.fn<IAuthService>(() => ({
      canAccept: jest.fn(async (address, nonce, signature) => false)
    }))

    const authController = new AuthController(new AuthService())
    app.keys = [ 'SECRET' ]
    app.use(session(app))
    app.use(bodyParser())
    app.use(authController.middleware)

    const response = await request(app.callback()).post('/challenge').send({
      address: ADDRESS,
      nonce: await nonce(ADDRESS),
      signature: 'SIGNATURE'
    })

    expect(response.badRequest).toBe(true)
    expect(response.body).toEqual({ isAccepted: false })
    expect(response.header['set-cookie']).toBeFalsy()
  })
})
