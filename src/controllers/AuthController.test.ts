import * as request from 'supertest'
import * as Koa from 'koa'
import AuthController from "./AuthController";
import IAuthService from "../services/IAuthService";

const app = new Koa()

const ADDRESS = '0xADDRESS'
const nonce = async (address: string) => `NONCE FOR ${address}`

const AuthService = jest.fn<IAuthService>(() => ({
  generateChallenge: nonce
}))

const authService = new AuthService()

const authController = new AuthController(authService)
app.use(authController.middleware)

test('GET /challenge', async () => {
  const response = await request(app.callback()).get('/challenge').query({ address: ADDRESS })

  expect(response.status).toBe(200)
  expect(response.body).toEqual({ nonce: await nonce(ADDRESS) })
})
