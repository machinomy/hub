import * as request from 'supertest'
import * as Koa from 'koa'
import Registry from './Registry'
import Configuration from './Configuration'

const app = new Koa()

beforeAll(async () => {
  const configuration = await Configuration.env()
  const registry = await Registry.build(configuration)
  const routes = await registry.routes()

  app.use(routes.middleware)
})

test('GET / redirect to /frontend', async () => {
  const response = await request(app.callback()).get('/')
  expect(response.redirect).toBe(true)
  expect(response.header['location']).toBe('/frontend')
  expect(response.body).toEqual({})
})
