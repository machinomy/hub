import * as request from 'supertest'
import * as Koa from 'koa'
import PaymentsController from './PaymentsController'
import * as Web3 from 'web3'
import Machinomy from 'machinomy'

const app = new Koa()
const machinomy = new Machinomy('0xdead', new Web3(), { databaseUrl: 'sqlite3://test' })

const paymentsController = new PaymentsController(machinomy)
app.use(paymentsController.routes)

test('HEAD /accept', async () => {
  const response = await request(app.callback()).head('/accept')
  expect(response.status).toBe(204)
  expect(response.body).toEqual({})
})

test('POST /payments/accept', async () => {
  const body = { payment: { } }
  const expectedResponse = { token: 'token' }
  const spy = jest.spyOn(machinomy, 'acceptPayment')
  spy.mockReturnValue(expectedResponse)
  const response = await request(app.callback()).post('/accept').send(body)
  spy.mockRestore()
  expect(response.status).toEqual(202)
  expect(response.body).toEqual(expectedResponse)
})

describe('GET /payments/verify/:token', () => {
  test('valid', async () => {
    const token = 'foo'
    const spy = jest.spyOn(machinomy, 'acceptToken')
    spy.mockReturnValue({ status: true })
    const response = await request(app.callback()).get(`/verify/${token}`)
    spy.mockRestore()
    expect(response.status).toEqual(200)
  })

  test('invalid', async () => {
    const token = 'foo'
    const spy = jest.spyOn(machinomy, 'acceptToken')
    spy.mockReturnValue({ status: false })
    const response = await request(app.callback()).get(`/verify/${token}`)
    spy.mockRestore()
    expect(response.status).toEqual(400)
  })
})
