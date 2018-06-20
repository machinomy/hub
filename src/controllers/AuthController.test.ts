import * as request from 'supertest'
import * as Koa from 'koa'
import AuthController from "./AuthController";
import IAuthService from "../services/IAuthService";
import {NONAME} from 'dns';
import bodyParser = require('koa-bodyparser');

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
    app.use(bodyParser())
    app.use(authController.middleware)

    const response = await request(app.callback()).post('/challenge').send({
      address: ADDRESS,
      nonce: await nonce(ADDRESS),
      signature: 'SIGNATURE'
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ isAccepted: true })
  })

  test('not accept', async () => {
    const app = new Koa()
    const AuthService = jest.fn<IAuthService>(() => ({
      canAccept: jest.fn(async (address, nonce, signature) => false)
    }))

    const authController = new AuthController(new AuthService())
    app.use(bodyParser())
    app.use(authController.middleware)

    const response = await request(app.callback()).post('/challenge').send({
      address: ADDRESS,
      nonce: await nonce(ADDRESS),
      signature: 'SIGNATURE'
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ isAccepted: false })
  })
})
